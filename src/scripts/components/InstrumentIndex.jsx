import React from "react"
import InstrumentTable from './InstrumentTable.jsx!'
import InstrumentInspector 
  from './InstrumentInspector.jsx!'

class InstrumentIndex extends React.Component {
  render() {
    let instruments = this.props.instruments
      .map((instrument) => {
        instrument.inStock = 
          instrument.amount - instrument.reserved
        return instrument
      })
    return (
      <div>
        <InstrumentTable 
          instruments={instruments}
          actions={this.props.actions}
        />
      <InstrumentInspector 
        currentID={this.props.currentID} 
        instruments={instruments}
        actions={this.props.actions}
      />
      </div>
    )
  }
}

export default InstrumentIndex