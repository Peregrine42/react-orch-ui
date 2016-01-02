import React from "react"

export default class TableBody extends React.Component {
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
