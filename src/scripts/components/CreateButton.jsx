import React from "react"

export default class CreateButton extends React.Component {
  render() {
    return (
      <div>
        <input 
          type="button"
          onClick={this.props.actions.createRow}
          value="create"
        >
        </input>
      </div>
    )
  }
}