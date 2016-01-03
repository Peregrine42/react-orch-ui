import React from "react"
import TableHeader from './TableHeader.jsx!'
import TableBody from './TableBody.jsx!'

class InstrumentTable extends React.Component {
  render() {
    return (
      <table >
        <TableHeader/>
        <TableBody 
          rows={this.props.instruments}
          actions={this.props.actions}
          currentID={this.props.currentID}
        />
      </table>
    )
  }
}

export default InstrumentTable
