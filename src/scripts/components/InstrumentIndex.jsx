import React from "react"
import InstrumentTable from './InstrumentTable.jsx!'
import InstrumentInspector 
  from './InstrumentInspector.jsx!'
import CreateButton from './CreateButton.jsx!'

class InstrumentIndex extends React.Component {
  render() {
    let instruments = this.props.instruments
    instruments = instruments
      .map(this.props.actions.prerender)
    return (
      <div>
        <CreateButton
          actions={this.props.actions}
        />
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
          format={this.props.format}
        />
      </div>
    )
  }
}

export default InstrumentIndex