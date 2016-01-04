import React from 'react'
import ReactDOM from 'react-dom'
import { Router5 } from 'router5'
import { RouterProvider } from 'react-router5';
import historyPlugin from 'router5-history';
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
        readAll: this.readAll,
        update: this.update,
        destroy: this.destroy.bind(this),
        scheduleUpdate: this.scheduleUpdate,
        setID: this.setID.bind(this),
        rows: this.store.rows,
        updateRow: this.store.updateRow,
        setTimer: this.store.setTimer,
        findByID: this.type.findByID,
        indexFromID: this.type.indexFromID,
        prerender: this.type.prerender,
        format: this.store.format,
      },
      timeouts: {
        pauseUpdates: undefined,
      },
      currentID: -1,
      type: this.type,
      format: true
    })
    setInterval(
      this.triggerUpdateFromServer.bind(this), 1000
    )
    this.triggerUpdateFromServer()
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
    let state = apiStore.store()
    if (!state.timer) {
      let timerID = setTimeout(() => {
        this.update(target)
        apiStore.store.setTimer(undefined)
      }, 1000)
      apiStore.store.setTimer(timerID)
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

function createRouter(routes) {
  const router = new Router5()
    .setOption('useHash', true)
    .setOption('defaultRoute', 'instruments')
    .addNode('instruments_home', '/instruments')
    .addNode('instruments', '/instruments/:id')
    .addNode('about', '/about')
    .usePlugin(Router5.loggerPlugin())
    .usePlugin(historyPlugin())
    .start()
  return router
}

class Nav extends React.Component {
  render() {
    return (
      <div className="nav">
        <a onClick={
            this.props.router.navigate(
              'about',
              {section: 'about'},
              {reload: true}
            )
          }
        >
        about 
        </a>
        <a onClick={
            this.props.router.navigate(
              'instruments_home',
              {section: 'instruments_home'},
              {reload: true}
            )
          }
        >
        instruments
        </a>
      </div>
    )
  }
}

function App(props) {
  console.log(props)
  return (
    <div>
      <Nav router={props.router}/>
      <Main store={props.store} router={props.router}/>
    </div>
  )
}

function Main(props) {
  console.log(props)
  console.log(props.router.getLocation())
  return (
    <InstrumentMain store={props.store}/>
  )
}

let apiStore = new APIStore()
const router = createRouter()
apiStore.store.getState((store) => {
  const wrappedApp = (
    <RouterProvider router={router}>
      <App store={store} router={router}/>
    </RouterProvider>
  )
  
  ReactDOM.render(
    wrappedApp, document.getElementById("container")
  )
})
