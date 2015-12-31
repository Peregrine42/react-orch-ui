import React from "react"
import promise from 'stackp/promisejs/promise.js'

class TableHeader extends React.Component {
  constructor() {
    super()
  }
  
  render() {
    return (
      <thead>
        <tr>
          <th>Name</th>
          <th>Amount</th>
          <th>Price</th>
        </tr>
      </thead>
    )
  }
}

class Instrument {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.amount = data.amount
    this.reserved = data.reserved
    this.price = data.price
  }
  
  get inStock() {
    return this.amount - this.reserved
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

class MyReactComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      instruments: []
    }
  }
  ajaxInstruments() {
    return promise.get(
      "http://localhost:3000/instruments.json"
    )
  }
  componentDidMount() {
    this.ajaxInstruments().then(
      (error, data) => {
        if (!error) {
          let parsed = JSON.parse(data)
          let asInstruments = parsed
            .map((instrument) => {
              return new Instrument(instrument)
            })
          this.setState({ instruments: asInstruments })
        }
      }
    )
  }
  render() {
    return (
      <table >
        <TableHeader/>
        <TableBody rows={this.state.instruments}/>
      </table>
    )
  }
}

export default MyReactComponent