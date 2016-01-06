import React from "react"
import classNames from "classnames"

export default class TableBody extends React.Component {
  handleClick(id) {
    let actions = this.props.actions
    if (this.props.currentID != id) {
      actions.setID(id)
    }
  }
  destroy(id, e) {
    e.stopPropagation()
    e.preventDefault()
    let userDecision = confirm(
      "Are you sure you would like to delete this item?"
    )
    if (userDecision) { this.props.actions.destroy(id) }
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
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.formattedPrice}</td>
            <td 
              className={classNames(
                {error: row.inStock < 0 }
              )}
            >
              {this.stockLevels(row)}
            </td>
            <td>
              <a
                onClick={
                  this.destroy.bind(
                    this, row.id
                  )
                }
              >delete</a>
            </td>
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
