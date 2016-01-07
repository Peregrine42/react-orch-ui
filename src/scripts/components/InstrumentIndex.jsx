import React from "react"
import InstrumentTable from './InstrumentTable.jsx!'
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
          instruments={instruments}
          currentID={this.props.currentID} 
          type={this.props.type}
          timer={this.props.timer}
          format={this.props.format}
        />
        <InstrumentTable 
          currentID={this.props.currentID} 
          instruments={instruments}
          actions={this.props.actions}
        />
      </div>
    )
  }
}

export default InstrumentIndex