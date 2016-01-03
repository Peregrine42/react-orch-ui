import React from 'react'
import ReactDOM from 'react-dom'
import Hoverboard from "hoverboard"
import promise from 'stackp/promisejs/promise.js'
import _ from 'lodash'

import InstrumentIndex 
  from './components/InstrumentIndex.jsx!'
import Instrument from "./components/Instrument.js"

class APIStore {
  constructor() {
    this.type = Instrument
    this.store = Hoverboard({
      init(state, init_state) {
        return init_state
      },
      format(state, format) {
        state.format = format
        return state
      },
      rows(state, data) {
        let newState = data.map(state.type.update.bind(
          null, state.rows
        ))
        state.rows = _
          .sortBy(newState, state.type.sorter)
        return state
      },
      error(state, error) {
        state.error = error
        return state
      },
      setTimer(state, id) {
        state.timer = id
        return state
      },
      setCurrentID(state, id) {
        state.format = true
        state.currentID = id
        return state
      },
      updateRow(state, id, newRow) {
        let index = state.actions.indexFromID(
          id, state.rows
        )
        state.rows[index] = newRow
        return state
      }
    })
    this.store.init({
      rows: [],
      actions: {
        readAll: this.readAll,
        update: this.update,
        scheduleUpdate: this.scheduleUpdate,
        setID: this.setID.bind(this),
        error: this.store.error,
        rows: this.store.rows,
        updateRow: this.store.updateRow,
        setTimer: this.store.setTimer,
        findByID: this.type.findByID,
        indexFromID: this.type.indexFromID,
        prerender: this.type.prerender,
        format: this.store.format
      },
      timeouts: {
        pauseUpdates: undefined,
      },
      currentID: -1,
      type: this.type,
      format: true
    })
    setInterval(
      this.triggerUpdateFromServer.bind(this), 3000
    )
    this.triggerUpdateFromServer()
  }
  readAll() {
    return promise.get(
      Instrument.baseURL() + ".json"
    )
  }
  update(data) {
    promise.put(
      `${Instrument.baseURL()}/${data.id}.json`, data
    )
  }
  scheduleUpdate(target) {
    let state = apiStore.store()
    if (!state.timer) {
      let timerID = setTimeout(() => {
        this.update(target)
        apiStore.store.setTimer(undefined)
      }, 3000)
      apiStore.store.setTimer(timerID)
    }
  }
  handleUpdateFromServer(error, data) {
    if (error) {
      return this.store.error(error)
    }
    let parsed = JSON.parse(data)
    let validated = parsed.map(
      this.type.valid
    )
    this.store.rows(validated)
  }
  triggerUpdateFromServer() {
    if (!this.store().timer) {
      this.readAll()
        .then(this.handleUpdateFromServer.bind(this))
    }
  }
  setID(id, e) {
    this.store.setCurrentID(id)
    promise.get(
      this.type.baseURL() + "/" + id + ".json"
    )
    .then((error, data) => {
      let parsed = JSON.parse(data)
      let validated = 
        this.type.valid(parsed)
      this.store.updateRow(
        id, validated
      )
    })
  }
}

let apiStore = new APIStore()
apiStore.store.getState((props) => {
  ReactDOM.render(
    <InstrumentIndex 
      currentID={props.currentID}
      instruments={props.rows}
      actions={props.actions}
      timeouts={props.timeouts}
      type={props.type}
      timer={props.timer}
      format={props.format}
    />,
    document.getElementById('container')
  )
})
