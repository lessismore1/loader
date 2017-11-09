import React from 'react'
import { connect } from "react-redux";

import { selectors } from '../reducers';
import Balance from './Balance'

class EthereumState extends React.Component {
  render() {
    if (this.props.success) {
      return <div>
        <div>Connected</div>
        <Balance />
      </div>
    }
    return <div>Connecting to Ethereum...</div>
  }
}
export default connect(selectors.ethereumState)(EthereumState)
