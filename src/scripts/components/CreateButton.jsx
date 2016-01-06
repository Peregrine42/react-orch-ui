import React from "react"

export default class CreateButton extends React.Component {
  render() {
    return (
      <div>
        <a
          onClick={this.props.actions.createRow}
        >
        create</a>
      </div>
    )
  }
}