import React from 'react'
import ReactDOM from 'react-dom'
import promise from 'stackp/promisejs/promise.js'

import MyReactComponent from './MyReactComponent.jsx!'

var ajaxInstruments = () => {
  return promise.get(
    "http://localhost:3000/instruments.json"
  )
}

ajaxInstruments().then(
  (error, data) => {
    ReactDOM.render(
      <MyReactComponent
        instruments={JSON.parse(data)}
      />,
      document.getElementById('container')
    )
  }
)
