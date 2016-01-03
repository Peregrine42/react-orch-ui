import React from "react"

export default class TableBody extends React.Component {
  handleClick(id) {
    let actions = this.props.actions
    if (this.props.currentID != id) {
      actions.setID(id)
    }
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
