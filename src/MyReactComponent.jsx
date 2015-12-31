import React from "react"

var colors = ['#FF0000', '#00FF00', '#0000FF']

class MyReactComponent extends React.Component {
  constructor() {
    super()
    
    this.state = {
      colorIndex: 0
    }
  }
  handleClick(e) {
    e.preventDefault()
    let nextColor = this.state.colorIndex + 1
    let setColor = 
      nextColor > colors.length - 1 ? 0 : nextColor
    
    this.setState({
      colorIndex: setColor
    })
  }
  
  render() {
    let color = colors[this.state.colorIndex]
    return (
    <a 
      href="#" 
      style={{ color: color }} 
      onClick={this.handleClick.bind(this)}
    >
      Hello there, { this.props.name }!
    </a>)
  }
}

export default MyReactComponent