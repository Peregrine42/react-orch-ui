import React from "react"

export default class TableBody extends React.Component {
  handleClick(id) {
    let actions = this.props.actions
    if (this.props.currentID != id) {
      actions.setID(id)
    }
  }
  stockLevels(current) {
    return `${current.inStock} (${current.reserved})`
  }
  render() {
    let rows = this.props.rows
      .map((row) => {
        return (
          <tr 
            key={row.id} 
            onClick={this.handleClick.bind(this, row.id)}
          >
            <td>{row.name}</td>
            <td>{row.formattedPrice}</td>
            <td>{this.stockLevels(row)}</td>
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
