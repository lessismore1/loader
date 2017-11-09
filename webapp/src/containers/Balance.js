import React from 'react'
import { connect } from "react-redux";

import { selectors } from '../reducers';

class Balance extends React.Component {
  render() {
    return <div>Balance</div>
  }
}
export default connect(selectors.balance)(Balance)
