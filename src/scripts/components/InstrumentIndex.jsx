import React from "react"

class TableHeader extends React.Component {
  constructor() {
    super()
  }
  
  render() {
    return (
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>amount (in stock)</th>
          <th>price</th>
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
    let rows = this.props.rows
      .map((row) => {
        return (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.inStock}</td>
            <td>{row.price}</td>
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
        <TableBody rows={this.props.instruments}/>
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
            onChange={actions.handleChange}
          />
        </div>
        <div>
          <label htmlFor="amount">amount:</label>
          <input 
            type="amount" id="amount"
            value={current.amount}
          />
        </div>
        <div>
          <label htmlFor="name">reserved:</label>
          <input 
            type="text" id="reserved"
            value={current.reserved}
          />
        </div>
        <div>
          <label htmlFor="inStock">in stock:</label>
          <span> {current.inStock}</span>
        </div>
        <div>
          <label htmlFor="name">description:</label>
          <input 
            type="text" id="description"
            value="{{rows[activeRow].description}}"
          />
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