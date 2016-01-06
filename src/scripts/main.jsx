import React from 'react'
import ReactDOM from 'react-dom'
import Hoverboard from "hoverboard"
import page from "page"
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
      setSelected(state, selected) {
        state.selected = selected
        return state
      },
      setPath(state, path, params) {
        state.params = params || state.params
        state.path = path || state.path
        return state
      },
      destroy(state, id) {
        let index = state.type.indexFromID(
          id, state.rows
        )
        if (index > -1) {
          state.rows.splice(index, 1)
        }
        state.currentID = -1
        return state
      },
      format(state, format) {
        state.format = format
        return state
      },
      rows(state, data, id) {
        let newState = data.map(state.type.update.bind(
          null, state.rows
        ))
        state.rows = _
          .sortBy(newState, state.type.sorter)
        let index = state.actions.indexFromID(
          id, state.rows
        )
        if (!id) { id = state.currentID }
        state.currentID = id
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
        createRow: this.createRow.bind(this),
        readAll: this.readAll.bind(this),
        update: this.update.bind(this),
        destroy: this.destroy.bind(this),
        scheduleUpdate: this.scheduleUpdate.bind(this),
        setID: this.setID.bind(this),
        rows: this.store.rows,
        updateRow: this.store.updateRow,
        setTimer: this.store.setTimer,
        findByID: this.type.findByID,
        indexFromID: this.type.indexFromID,
        prerender: this.type.prerender,
        format: this.store.format,
        unsubscribe: this.stopUpdating.bind(this),
        subscribe: this.startUpdating.bind(this),
        setSelected: this.store.setSelected
      },
      timeouts: {
        pauseUpdates: undefined,
      },
      currentID: -1,
      type: this.type,
      format: true
    })
    this.triggerUpdateFromServer()
  }
  startUpdating() {
    this.timerID = setInterval(
      this.triggerUpdateFromServer.bind(this), 1500
    )
  }
  stopUpdating() {
    clearInterval(this.timerID)
  }
  createRow() {
    promise.post(
      Instrument.baseURL() + ".json"
    ).then((error, data) => {
      if (!error) {
        let parsed = JSON.parse(data)
        let valid = this.type.valid(parsed)
        this.triggerUpdateFromServer(valid.id)
      }
    })
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
  destroy(id) {
    promise.del(`${Instrument.baseURL()}/${id}.json`)
    this.store.destroy(id)
  }
  scheduleUpdate(target) {
    let state = this.store()
    if (!state.timer) {
      let timerID = setTimeout(() => {
        this.update(target)
        this.store.setTimer(undefined)
      }, 1000)
      this.store.setTimer(timerID)
    }
  }
  handleUpdateFromServer(index, error, data) {
    if (error) {
      return
    }
    let parsed = JSON.parse(data)
    let validated = parsed.map(
      this.type.valid
    )
    this.store.rows(validated, index)
  }
  triggerUpdateFromServer(index) {
    if (!this.store().timer) {
      this.readAll()
        .then(
          this.handleUpdateFromServer.bind(this, index)
        )
      let id = this.store().currentID
      if (id > -1) { this.read(id) }
    }
  }
  read(id) {
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
  setID(id, e) {
    this.store.setCurrentID(id)
    this.read(id)
  }
}

class InstrumentMain extends React.Component {
  componentWillUnmount() {
    this.props.store.actions.unsubscribe()
  }
  componentDidMount() {
    this.props.store.actions.subscribe()
  }
  render() {
    return (
      <InstrumentIndex 
        currentID={this.props.store.currentID}
        instruments={this.props.store.rows}
        actions={this.props.store.actions}
        timeouts={this.props.store.timeouts}
        type={this.props.store.type}
        timer={this.props.store.timer}
        format={this.props.store.format}
        params={this.props.store.params}
      />
    )
  }
}

class About extends React.Component {
  render() {
    return (
      <div>
        Hello! This is the About page! :-)
      </div>
    )
  }
}

class Nav extends React.Component {
  render() {
    return (
      <div className="nav">
        <a onClick={
            (e) => { }
          }
        >
        about
        </a>
        <a onClick={
            (e) => { }
          }
        >
        instruments
        </a>
      </div>
    )
  }
}

function App(props) {
  return (
    <div>
      <Main 
        store={props.store}
        unsubscribe={props.unsubscribe}
      />
    </div>
  )
}

function Main(props) {
  let current_location = props.store.path
  let element = 
    current_location === 
      "/about" ? 
        <About/> : <InstrumentMain 
          store={props.store}
        />
  return (
    element
  )
}


let api = new APIStore()
api.store.getState((new_store) => {
  ReactDOM.render(
    <App 
      store={new_store}
      />,
    document.getElementById("container")
  )
})
