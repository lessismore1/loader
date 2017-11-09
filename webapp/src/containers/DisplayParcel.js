import React from 'react'
import { connect } from "react-redux";

import { selectors } from '../reducers';

class Balance extends React.Component {
  render() {
    return <div>{this.props.x} {this.props.y} {JSON.stringify(this.props.parcel)}</div>
  }
}
export default connect(selectors.display)(Balance)
