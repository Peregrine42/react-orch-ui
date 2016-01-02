import React from 'react'
import ReactDOM from 'react-dom'
import Hoverboard from "hoverboard"
import promise from 'stackp/promisejs/promise.js'
import _ from 'lodash'

import InstrumentIndex 
  from './components/InstrumentIndex.jsx!'

class Instrument {
  static valid(data) {
    return {
      id: data.id,
      name: data.name,
      amount: data.amount,
      reserved: data.reserved,
      price: data.price,
      description: data.description
    }
  }
  static baseURL() {
    return (
      "http://localhost:3000/instruments"
    )
  }
}

class APIStore {
  constructor() {
    this.store = Hoverboard({
      init(state, init_state) {
        return init_state
      },
      update(state) {
        if (
          state.timeouts.disableServerActions == null
        ) {
          state.actions.readAll()
            .then((error, data) => {
              if (error) {
                return state.actions.error(error)
              }
              let parsed = JSON.parse(data)
              let validated = parsed.map(
                Instrument.valid
              )
              state.actions.rows(validated)
            })
        }
        return state
      },
      clearUpdateTimeout(state) {
        clearTimeout(
          state.timeouts.disableServerActions
        )
        state.timeouts.disableServerActions = null
        return state
      },
      rows(state, data) {
        let newState = data.map((newData) => {
          let oldData = 
            state.actions.findByID(
              newData.id, state.rows
            )
          if (!oldData) { return newData }
          return (_.extend(newData, oldData, 
            (v, o) => {
              return _.isUndefined(v) ? o : v
            }))
        })
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
      setID(state, id, e) {
        state.currentID = id
        promise.get(
          Instrument.baseURL() + "/" + id + ".json"
        )
          .then((error, data) => {
            let parsed = JSON.parse(data)
            let validated = 
              Instrument.valid(parsed)
            let new_rows = state.rows
              .map((row) => {
                if (row.id === state.currentID)
                {
                  return validated
                }
                return row
              })
            state.actions.rows(new_rows)
          })
        return state
      },
      handleChange(state, label, e) {
        let newValue = e.target.value
        let currentID = state.currentID
        let target = 
          state.actions
            .findByID(currentID, state.rows)
        target[label] = newValue
        let baseURL = Instrument.baseURL() + "/"
        let targetURL = 
          baseURL + target.id
        if (
          state.timeouts.disableServerActions == null
        ) {
          state.timeouts.disableServerActions = 
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
        handleChange: this.store.handleChange,
        findByID: this.findByID,
        setID: this.store.setID,
        error: this.store.error,
        rows: this.store.rows,
        clearUpdateTimeout: 
          this.store.clearUpdateTimeout
      },
      timeouts: {
        disableServerActions: null,
      },
      currentID: -1,
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
    promise.put(
      `${Instrument.baseURL()}/${data.id}.json`, data
    )
  }
  findByID(id, rows) {
    let filtered = rows.filter((row) => {
      return id === row.id
    })
    if (filtered.length > 0) { return filtered[0] }
    return false
  }
}

let apiStore = new APIStore()
apiStore.store.getState((props) => {
  ReactDOM.render(
    <InstrumentIndex 
      currentID={props.currentID}
      instruments={props.rows}
      actions={props.actions}
    />,
    document.getElementById('container')
  )
})
