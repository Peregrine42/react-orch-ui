import React from 'react'
import ReactDOM from 'react-dom'
import Hoverboard from "hoverboard"
import promise from 'stackp/promisejs/promise.js'

import InstrumentIndex 
  from './components/InstrumentIndex.jsx!'
  
class APIStore {
  constructor() {
    this.store = Hoverboard({
      init(state) {
        return { 
          instruments: [],
        }
      },
      instruments(state, data) {
        state.instruments = data
        return state
      },
      error(state, error) {
        store.error = error
        return state
      }
    })
    this.store.init()
    setInterval(this.update.bind(this), 3000)
    this.update()
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
      "http://localhost:3000/instruments.json"
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
    <InstrumentIndex instruments={props.instruments}/>,
    document.getElementById('container')
  )
})
