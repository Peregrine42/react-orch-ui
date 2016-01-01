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

class InstrumentIndex extends React.Component {
  constructor() {
    super()
    this.props = {
      instruments: []
    }
  }
  render() {
    return (
      <table >
        <TableHeader/>
        <TableBody rows={this.props.instruments}/>
      </table>
    )
  }
}

export default InstrumentIndex