import React from 'react'
import { connect } from "react-redux";

import { selectors } from '../reducers';

class Balance extends React.Component {
  render() {
    if (this.props.loading) {
      return <div>Loading balance...</div>
    }
    return <div>Balance: { this.props.amount } LAND</div>
  }
}
export default connect(selectors.balance)(Balance)
