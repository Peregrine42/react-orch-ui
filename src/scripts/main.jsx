import React from 'react'
import ReactDOM from 'react-dom'
import Hoverboard from "hoverboard"
import promise from 'stackp/promisejs/promise.js'
import _ from 'lodash'

import InstrumentIndex 
  from './components/InstrumentIndex.jsx!'

class APIStore {
  constructor() {
    this.baseURL = 
      "http://localhost:3000/instruments"
    this.store = Hoverboard({
      init(state, init_state) {
        return init_state
      },
      clearUserTimeout(state) {
        clearTimeout(state.timeouts.userFinishedInput)
        state.timeouts.userFinishedInput = null
        return state
      },
      instruments(state, data) {
        let newState = data.map((newData) => {
          let oldData = 
            state.actions.findByID(
              newData.id, state.instruments
            )
          if (!oldData) { return newData }
          return (_.extend(newData, oldData, 
            (v, o) => {
              return _.isUndefined(v) ? o : v
            }))
        })
        state.instruments = _
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
          state.baseURL + "/" + id + ".json"
        )
          .then((error, data) => {
            let parsed = JSON.parse(data)
            let validated = 
              state.actions.validInstrument(parsed)
            let new_instruments = state.instruments
              .map((instrument) => {
                if (instrument.id === state.currentID)
                {
                  return validated
                }
                return instrument
              })
            state.actions.instruments(new_instruments)
          })
        return state
      },
      handleChange(state, label, e) {
        let newValue = e.target.value
        let currentID = state.currentID
        let target = 
          state.actions
            .findByID(currentID, state.instruments)
        target[label] = newValue
        let baseURL = state.baseURL + "/"
        let targetURL = 
          baseURL + target.id
        if (state.timeouts.userFinishedInput == null) {
          state.timeouts.userFinishedInput = 
            setTimeout(() => {
              state.actions.put(targetURL, target)
              state.actions.clearUserTimeout()
            }, 2000)
        }
        return state
      }
    })
    this.store.init({
      instruments: [],
      actions: {
        handleChange: this.store.handleChange,
        findByID: this.findByID,
        put: this.put,
        setID: this.store.setID,
        validInstrument: this.validInstrument,
        instruments: this.store.instruments,
        clearUserTimeout: this.store.clearUserTimeout
      },
      timeouts: {
        userFinishedInput: null,
      },
      currentID: -1,
      baseURL: this.baseURL
    })
    setInterval(this.update.bind(this), 3000)
    this.update()
  }
  put(url, data) {
    promise.put(url + ".json", data)
  }
  findByID(id, instruments) {
    let filtered = instruments.filter((instrument) => {
      return id === instrument.id
    })
    if (filtered.length > 0) { return filtered[0] }
    return false
  }
  validInstrument(data) {
    return {
      id: data.id,
      name: data.name,
      amount: data.amount,
      reserved: data.reserved,
      inStock: (
        parseInt(data.amount) - 
        parseInt(data.reserved)
      ),
      price: data.price,
      description: data.description
    }
  }
  updateStore(data) {
    let validated = data.map(this.validInstrument)
    this.store.instruments(validated)
  }
  update() {
    if (state.timeouts.userFinishedInput == null) {
      return promise.get(
        this.baseURL + ".json"
      ).then((error, data) => {
        if (error) {
          return this.store.error(error)
        }
        let parsed = JSON.parse(data)
        this.updateStore(parsed)
      })
    }
  }
}

let apiStore = new APIStore()
apiStore.store.getState((props) => {
  ReactDOM.render(
    <InstrumentIndex 
      currentID={props.currentID}
      instruments={props.instruments}
      actions={props.actions}
    />,
    document.getElementById('container')
  )
})
