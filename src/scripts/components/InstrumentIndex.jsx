import React from "react"

class TableHeader extends React.Component {
  constructor() {
    super()
  }
  
  render() {
    return (
      <thead>
        <tr>
          <th>name</th>
          <th>price (£)</th>
          <th>amount (in stock)</th>
        </tr>
      </thead>
    )
  }
}

class TableBody extends React.Component {
  constructor() {
    super()
  }
  
  render() {
    let actions = this.props.actions
    let rows = this.props.rows
      .map((row) => {
        return (
          <tr 
            key={row.id} 
            onClick={actions.setID.bind(null, row.id)}
          >
            <td>{row.name}</td>
            <td>{row.price}</td>
            <td>{row.inStock}</td>
          </tr>
        )
    })
    return (
      <tbody>
        {rows}
      </tbody>
    )
  }
}

class InstrumentTable extends React.Component {
  render() {
    return (
      <table >
        <TableHeader/>
        <TableBody 
          rows={this.props.instruments}
          actions={this.props.actions}
        />
      </table>
    )
  }
}

class InstrumentInspector extends React.Component {
  render() {
    var id = this.props.currentID
    var actions = this.props.actions
    var current = actions.findByID(
      id, this.props.instruments
    )
    if (!(current instanceof Object) || current.error) {
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
              actions.handleChange.bind(null, "name")
            }
          />
        </div>
        <div>
          <label htmlFor="name">description:</label>
          <input 
            type="text" id="description"
            value={current.description}
            onChange={
              actions.handleChange.bind(
                null, "description"
              )
            }
          />
        </div>
        <div>
          <label htmlFor="price">price (£):</label>
          <input 
            type="text" id="price"
            value={current.price}
            onChange={
              actions.handleChange.bind(
                null, "price"
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
              actions.handleChange.bind(null, "amount")
            }
          />
        </div>
        <div>
          <label htmlFor="name">reserved:</label>
          <input 
            type="text" id="reserved"
            value={current.reserved}
            onChange={
              actions.handleChange.bind(
                null, "reserved"
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

class InstrumentIndex extends React.Component {
  constructor() {
    super()
    this.props = {
      instruments: []
    }
  }
  render() {
    return (
      <div>
        <InstrumentTable 
          instruments={this.props.instruments}
          actions={this.props.actions}
        />
      <InstrumentInspector 
        currentID={this.props.currentID} 
        instruments={this.props.instruments}
        actions={this.props.actions}
      />
      </div>
    )
  }
}

export default InstrumentIndex