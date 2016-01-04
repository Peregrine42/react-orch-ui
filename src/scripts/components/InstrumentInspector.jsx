import React from "react"
import classNames from "classnames"

class HideableInput extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      focusedValue: this.props.focusedValue
    }
  }
  handleFocus(e) {
    e.target.select()
  }
  handleBlur(e) {
    this.props.handleBlur()
  }
  handleChange(e) {
    let name = this.props.name
    let current = this.props.current
    this.props.handleChange(name, current, e)
  }
  render() {
    return (
      <input autoFocus
        type="text" id={name}
        onChange={(e) => {
          this.state.focusedValue = e.target.value
          this.handleChange(e)
        }}
        className={
          this.props.active ? "show" : "hide"
        }
        onBlur={this.handleBlur.bind(this)}
        onFocus={this.handleFocus.bind(this)}
        value={this.state.focusedValue}
      />
    )
  }
}
class MutableField extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      active: false,
      focusedValue: ""
    }
  }
  
  render() {
    let name = this.props.name
    let formattedName = 
      this.props.formattedName || name
    let current = this.props.current
    let handleChange = this.props.handleChange
    let unit = this.props.unit || ""
    let input = !this.state.active ?
        <div/> : <HideableInput 
          active={this.state.active}
          focusedValue={current[formattedName]}
          handleBlur={
            () => { 
              this.state.active = false
              this.props.actions.setSelected(null)
            }
          }
          handleChange={handleChange}
          name={this.props.name}
          current={current}
        />
    return (
      <div>
        <div className="horizontal">
          <label htmlFor={name}>{name + ": "}</label>
          <span 
            className={
              !this.state.active ? "show" : "hide"
            }
            onClick={
              (e) => {
                this.state.active = true
                this.state.focusedValue = current[name]
                this.props.actions.setSelected(name)
              }
            }
            >
            {unit + current[formattedName]}
          </span>
          {input}
        </div>
      </div>
    )
  }
}

class InstrumentInspector extends React.Component {
  handleChange(label, target, e) {
    e.preventDefault()
    e.stopPropagation()
    let value = e.target.value
    if (label === "amount") {
      value = parseInt(value)
      if (!value || value <= 0) {
        value = 0
      }
    }
    if (label === "reserved") {
      value = parseInt(value)
      if (
        !value || 
        value <= 0
      ) {
        value = 0
      }
      if (value > target.amount) {
        return false
      }
    }
    if (label === "price") {
      value = value.replace(/,/g, "")
      value = parseFloat(value)
    }
    this.delayedChange(
      label, value
    )
  }
  delayedChange(label, newValue) {
    let currentID = this.props.currentID
    let target = this.props.actions.findByID(
      currentID, this.props.rows
    )
    target[label] = newValue
    if (!this.props.timer) {
      let timerID =
        this.props.actions.scheduleUpdate(target)
    } 
    this.props.actions.updateRow(target.id, target)
  }
  price(row) {
    return row.formattedPrice 
  }
  render() {
    let id = this.props.currentID
    let actions = this.props.actions
    let current = actions.findByID(
      id, this.props.rows
    )
    if (!current) {
      return <div/>
    }
    return(
      <div>
        <MutableField 
          name="name" 
          current={current}
          handleChange={this.handleChange.bind(this)}
          actions={actions}
        />
        <MutableField 
          name="description" 
          current={current}
          handleChange={this.handleChange.bind(this)}
          actions={actions}
        />
        <MutableField 
          name="amount" 
          current={current}
          handleChange={this.handleChange.bind(this)}
          actions={actions}
        />
        <MutableField 
          name="reserved" 
          current={current}
          handleChange={this.handleChange.bind(this)}
          actions={actions}
        />
        <MutableField 
          name="price"
          formattedName="formattedPrice"
          current={current}
          unit="£"
          handleChange={this.handleChange.bind(this)}
          actions={actions}
        />
        <div>
          <label htmlFor="inStock">in stock: </label>
          <span className=
            {classNames(
              {error: current.inStock < 0 }
            )}
          >
            {current.inStock}
          </span>
        </div>
      </div>
    )
  }
}

export default InstrumentInspector