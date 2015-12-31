import React from 'react'
import ReactDOM from 'react-dom'

import MyReactComponent from './MyReactComponent.jsx!'

(() => {
  ReactDOM.render(
    <MyReactComponent name="Duncan" />,
    document.getElementById('container')
  )
})()