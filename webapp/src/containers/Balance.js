import React from 'react'
import { connect } from "react-redux";

import { selectors } from '../reducers';

class Balance extends React.Component {
  renderBalance() {
    return <div>
      <div>Balance: { this.props.amount } LAND</div>
      <ul>
        { this.renderList() }
      </ul>
    </div>
  }
  renderList() {
    return this.props.parcels.map(parcel => <li key={parcel.hash}>{parcel.x}, {parcel.y}</li>)
  }
  render() {
    if (this.props.loading) {
      return <div>Loading balance...</div>
    }
    if (this.props.amount) {
      return this.renderBalance()
    }
    return <div><strong>Loading balance...</strong></div>
  }
}
export default connect(selectors.balance)(Balance)
