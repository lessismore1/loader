import React from 'react'
import { connect } from "react-redux";

import { selectors } from '../reducers';
import { buyParcel } from '../actions';

const NO_OWNER = '0x0000000000000000000000000000000000000000'
const formatOwner = owner => owner.substr(2, 4) + '...' + owner.substr(38, 4)

class Balance extends React.Component {
  constructor(...args) {
    super(...args)
    this.buy = () => this.props.buyParcel(this.props.x, this.props.y)
  }
  renderBuy() {
    return <div className='selected-parcel'>
      <div>Selected Parcel: <strong>{this.props.x}, {this.props.y}</strong></div>
      <div>This parcel has no owner</div>
      <div className='buy-parcel'> <button onClick={this.buy}>Buy</button></div>
    </div>
  }
  render() {
    if (this.props.parcel) {
      if (this.props.parcel.owner === NO_OWNER) {
        return this.renderBuy()
      }
      return <div className='selected-parcel'>
        <div>Selected Parcel: <strong>{this.props.x}, {this.props.y}</strong></div>
        <div>Owner: <strong>{formatOwner(this.props.parcel.owner)}</strong></div>
        <div>Data: <strong>{this.props.parcel.metadata}</strong></div>
      </div>
    }
    if (!this.props.x) return ''
    return <div className='selected-parcel'>Selected Parcel: <strong>{this.props.x}, {this.props.y}</strong></div>
  }
}
export default connect(selectors.display, {
  buyParcel
})(Balance)
