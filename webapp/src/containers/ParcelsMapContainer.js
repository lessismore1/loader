import React from "react";
import { connect } from "react-redux";

import { selectors } from "../reducers";
import { parcelRangeChange } from "../actions";

import ParcelsMap from "../components/ParcelsMap";

class ParcelsMapContainer extends React.Component {
  constructor(...args) {
    super(...args)
    this.onMoveEnd = ({ bounds }) => {
      this.props.parcelRangeChange(bounds.min.x, bounds.max.x, bounds.min.y, bounds.max.y)
    }
  }

  componentWillMount() {
    this.props.parcelRangeChange(-10, 10, -10, 10)
  }

  render() {
    return <ParcelsMap
      x={0}
      y={0}
      zoom={10}
      bounds={[[-20.5, -20.5], [20.5, 20.5]]}
      tileSize={128}
      onClick={(...args) => console.log("MAP CLICK", args)}
      onMoveEnd={this.onMoveEnd}
    />
  }
}

export default connect(
  state => ({ parcelStates: selectors.getParcelStates(state) }),
  { parcelRangeChange }
)(ParcelsMapContainer);
