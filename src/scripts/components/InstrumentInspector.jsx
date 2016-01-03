import React from "react"

class InstrumentInspector extends React.Component {
  handleChange(label, target, e) {
    e.preventDefault()
    e.stopPropagation()
    let value = e.target.value
    if (label === "price") { 
      this.props.actions.format(false)
    }
    
    if (label === "amount") {
      if (parseInt(value) < 0) {
        return false
      }
    }
    if (label === "reserved") {
      if (parseInt(value) > target.amount) {
        return false
      }
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
    if (this.props.format) { 
      return row.formattedPrice 
    } 
    else { 
      return row.price 
    }
  }
  render() {
    let id = this.props.currentID
    let actions = this.props.actions
    let current = actions.findByID(id, this.props.rows)
    if (!current) {
      return <div/>
    }
    return(
      <div>
        <div>
          <label htmlFor="name">name:</label>
          <input 
            type="text" id="name" 
            value={current.name}
            onChange={
              this.handleChange.bind(
                this, "name", current
              )
            }
          />
        </div>
        <div>
          <label htmlFor="name">description:</label>
          <input 
            type="text" id="description"
            value={current.description}
            onChange={
              this.handleChange.bind(
                this, "description", current
              )
            }
          />
        </div>
        <div>
          <label htmlFor="price">price (£):</label>
          <input 
            type="text" id="price"
            value={this.price(current)}
            onChange={
              this.handleChange.bind(
                this, "price", current
              )
            }
          />
        </div>
        <div>
          <label htmlFor="amount">amount:</label>
          <input 
            type="amount" id="amount"
            value={current.amount}
            onChange={
              this.handleChange.bind(
                this, "amount", current
              )
            }
          />
        </div>
        <div>
          <label htmlFor="name">reserved:</label>
          <input 
            type="text" id="reserved"
            value={current.reserved}
            onChange={
              this.handleChange.bind(
                this, "reserved", current
              )
            }
          />
        </div>
        <div>
          <label htmlFor="inStock">in stock:</label>
          <span> {current.inStock}</span>
        </div>
      </div>
    )
  }
}

export default InstrumentInspector