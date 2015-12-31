import React from 'react'
import ReactDOM from 'react-dom'

import InstrumentIndex from './components/InstrumentIndex.jsx!'


ReactDOM.render(
  <InstrumentIndex interval={3000}/>,
  document.getElementById('container')
)
