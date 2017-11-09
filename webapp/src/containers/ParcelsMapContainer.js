import React from "react";
import { connect } from "react-redux";

import { selectors } from "../reducers";
import { clickParcel, parcelRangeChange } from "../actions";

import ParcelsMap from "../components/ParcelsMap";

class ParcelsMapContainer extends React.Component {
  constructor(...args) {
    super(...args)
    this.onMoveEnd = ({ bounds }) => {
      this.props.parcelRangeChange(
        Math.min(bounds.min.x, bounds.max.x),
        Math.max(bounds.min.x, bounds.max.x),
        Math.min(bounds.min.y, bounds.max.y),
        Math.max(bounds.min.y, bounds.max.y)
      )
    }
    this.onClick = (x, y) => {
      this.props.clickParcel(x, y)
    }
  }

  componentWillMount() {
    this.props.parcelRangeChange(-5, 5, -4, 4)
  }

  render() {
    return <ParcelsMap
      x={0}
      y={0}
      zoom={10}
      bounds={[[-120.5, -20.5], [120.5, 20.5]]}
      tileSize={128}
      onClick={this.onClick}
      onMoveEnd={this.onMoveEnd}
      parcelData={this.props.parcelStates}
    />
  }
}

export default connect(
  state => ({ parcelStates: selectors.getParcelStates(state) }),
  { parcelRangeChange, clickParcel }
)(ParcelsMapContainer);
