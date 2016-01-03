import React from "react"

class InstrumentInspector extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = { 
      format: false
    }
  }
  handleChange(label, e) {
    if (label === "price") { 
      this.state.format = true
    }
    this.delayedChange(
      label, e.target.value
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
    if (this.state.format) { return row.price } 
    else { return row.formattedPrice }
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
              this.handleChange.bind(this, "name")
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
                this, "description"
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
                this, "price"
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
              this.handleChange.bind(this, "amount")
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
                this, "reserved"
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