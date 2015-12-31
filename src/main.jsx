import React from 'react'
import ReactDOM from 'react-dom'

import MyReactComponent from './MyReactComponent.jsx!'


ReactDOM.render(
  <MyReactComponent interval={3000}/>,
  document.getElementById('container')
)
