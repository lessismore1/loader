import React from 'react'
import { connect } from "react-redux";

import { selectors } from '../reducers';
import { buyParcel } from '../actions';

const NO_OWNER = '0x0000000000000000000000000000000000000000'

class Balance extends React.Component {
  constructor(...args) {
    super(...args)
    this.buy = () => this.props.buyParcel(this.props.x, this.props.y)
  }
  renderBuy() {
    return <div>
      <div> {this.props.x}, {this.props.y}</div>
      <div> <button onClick={this.buy}>Buy</button></div>
    </div>
  }
  render() {
    if (this.props.parcel) {
      if (this.props.parcel.owner === NO_OWNER) {
        return this.renderBuy()
      }
      return <div>{this.props.x}, {this.props.y} {JSON.stringify(this.props.parcel)}</div>
    }
    return <div>{this.props.x}, {this.props.y}</div>
  }
}
export default connect(selectors.display, {
  buyParcel
})(Balance)
