import React from "react"

export default class TableHeader extends React.Component {
  constructor() {
    super()
  }
  
  render() {
    return (
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>price (£)</th>
          <th>available (reserved)</th>
          <th></th>
        </tr>
      </thead>
    )
  }
}
