import React from 'react'
import ReactDOM from 'react-dom'
import Hoverboard from "hoverboard"
import promise from 'stackp/promisejs/promise.js'

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
      instruments(state, data) {
        state.instruments = data
        return state
      },
      error(state, error) {
        state.error = error
        return state
      },
      handleChange(state, e) {
        let newValue = e.target.value
        let currentID = state.currentID
        let target = 
          state.actions
            .findByID(currentID, state.instruments)
        target.name = newValue
        let baseURL = state.baseURL + "/"
        let targetURL = 
          baseURL + target.id
        state.actions.post(targetURL, target)
        return state
      }
    })
    this.store.init({
      instruments: [],
      actions: {
        handleChange: this.store.handleChange,
        findByID: this.findByID,
        post: this.post
      },
      currentID: 4,
      baseURL: this.baseURL
    })
    setInterval(this.update.bind(this), 3000)
    this.update()
  }
  post(url, data) {
    promise.post(url + ".json", data)
  }
  findByID(id, instruments) {
    let filtered = instruments.filter((instrument) => {
      return id === instrument.id
    })
    if (filtered.length > 0) { return filtered[0] }
    return { error: "id not found" }
  }
  validInstrument(data) {
    return {
      id: data.id,
      name: data.name,
      amount: data.amount,
      reserved: data.reserved,
      inStock: data.amount - data.reserved,
      price: data.price
    }
  }
  updateStore(data) {
    let validated = data.map(this.validInstrument)
    this.store.instruments(validated)
  }
  update() {
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
