import React from "react"

export default class TableHeader extends React.Component {
  constructor() {
    super()
  }
  
  render() {
    return (
      <thead>
        <tr>
          <th>name</th>
          <th>price (£)</th>
          <th>amount (in stock)</th>
        </tr>
      </thead>
    )
  }
}
