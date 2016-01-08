import React from "react"
import InstrumentInspector 
  from './InstrumentInspector.jsx!'

export default class CreateButton extends React.Component {
  render() {
    return (
      <div>
        <div className="sticky table header panel">
          <ul className="header panel">
            <li className="header-element clickable"><a className="nav-link" href="/about.html">orch</a></li>
            <li className="header-element clickable"><a className="nav-link" href="/index.html">instruments</a></li>
            <li className="header-element clickable"
              onClick={this.props.actions.createRow}
            >
              new instrument
            </li>
          </ul>
          <InstrumentInspector 
            currentID={this.props.currentID} 
            rows={this.props.instruments}
            actions={this.props.actions}
            type={this.props.type}
            timer={this.props.timer}
            format={this.props.format}
          />
        </div>
      </div>
    )
  }
}
