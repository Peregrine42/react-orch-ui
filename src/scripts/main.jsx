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
      update(state) {
        if (!state.timer) {
          state.actions.readAll()
            .then((error, data) => {
              if (error) {
                return state.actions.error(error)
              }
              let parsed = JSON.parse(data)
              let validated = parsed.map(
                state.type.valid
              )
              state.actions.rows(validated)
            })
        }
        return state
      },
      clearUpdateTimeout(state) {
        clearTimeout(
          state.timeouts.pauseUpdates
        )
        state.timeouts.pauseUpdates = undefined
        return state
      },
      rows(state, data) {
        let newState = data.map(state.type.update.bind(
          null, state.rows
        ))
        state.rows = _
          .sortBy(newState, (i) => {
            return i.name
          })
        return state
      },
      error(state, error) {
        state.error = error
        return state
      },
      setTimer(state, id) {
        state.timer = id
        console.log(state)
        return state
      },
      setID(state, id, e) {
        state.currentID = id
        promise.get(
          state.type.baseURL() + "/" + id + ".json"
        )
          .then((error, data) => {
            let parsed = JSON.parse(data)
            let validated = 
              state.type.valid(parsed)
            state.actions.updateRow(
              state.currentID, validated
            )
          })
        return state
      },
      updateRow(state, id, newRow) {
        let index = state.actions.indexFromID(
          id, state.rows
        )
        state.rows[index] = newRow
        return state
      },
      scheduleUpdate(state, target) {
        if (
          _.isUndefined(state.timeouts.pauseUpdates)
        ) {
          state.timeouts.pauseUpdates = 
            setTimeout(() => {
              state.actions.update(target)
              state.actions.clearUpdateTimeout()
            }, 2000)
        }
        return state
      }
    })
    this.store.init({
      rows: [],
      actions: {
        readAll: this.readAll,
        update: this.update,
        scheduleUpdate: this.scheduleUpdate,
        handleChange: this.store.handleChange,
        setID: this.store.setID,
        error: this.store.error,
        rows: this.store.rows,
        clearUpdateTimeout: 
          this.store.clearUpdateTimeout,
        updateRow: this.store.updateRow,
        findByID: this.type.findByID,
        indexFromID: this.type.indexFromID,
        prerender: this.type.prerender,
        setTimer: this.store.setTimer
      },
      timeouts: {
        pauseUpdates: undefined,
      },
      currentID: -1,
      type: this.type
    })
    setInterval(this.store.update, 3000)
    this.store.update()
  }
  readAll() {
    return promise.get(
      Instrument.baseURL() + ".json"
    )
  }
  update(data) {
    console.log(data)
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
    />,
    document.getElementById('container')
  )
})
