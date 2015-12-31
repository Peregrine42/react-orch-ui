import React from "react"

var instruments = [
  { 
    id: 0,
    name: "Foo Instrument", 
    amount: 5, reserved: 2, 
    price: "£399.99" 
  },
  { 
    id: 1,
    name: "Bar Instrument", 
    amount: 9, reserved: 1, 
    price: "£599.99" 
  },
  { 
    id: 2,
    name: "Bak Instrument", 
    amount: 1, reserved: 1, 
    price: "£195.00" 
  }
]

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

class TableBody extends React.Component {
  constructor() {
    super()
  }
  
  render() {
    let rows = this.props.rows.map((row) => {
      return (
        <tr key={row.id}>
          <td>{row.name}</td>
          <td>{row.amount}</td>
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
  }
  
  render() {
    return (
    <table >
      <TableHeader/>
      <TableBody rows={instruments}/>
    </table>)
  }
}

export default MyReactComponent