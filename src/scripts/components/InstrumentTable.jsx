import React from "react"
import TableHeader from './TableHeader.jsx!'
import TableBody from './TableBody.jsx!'
import classnames from 'classnames'

class InstrumentTable extends React.Component {
  render() {
    return (
      <table className={classnames({"table column nowrap": true, "expanded": this.props.currentID > -1 })}>
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
