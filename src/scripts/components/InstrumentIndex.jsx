import React from "react"
import InstrumentTable from './InstrumentTable.jsx!'
import InstrumentInspector 
  from './InstrumentInspector.jsx!'

class InstrumentIndex extends React.Component {
  render() {
    let instruments = this.props.instruments
    instruments = instruments
      .map(this.props.actions.prerender)
    return (
      <div>
        <InstrumentTable 
          currentID={this.props.currentID} 
          instruments={instruments}
          actions={this.props.actions}
        />
        <InstrumentInspector 
          currentID={this.props.currentID} 
          rows={instruments}
          actions={this.props.actions}
          type={this.props.type}
          timer={this.props.timer}
        />
      </div>
    )
  }
}

export default InstrumentIndex