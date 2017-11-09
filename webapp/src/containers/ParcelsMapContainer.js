import React from "react";
import { connect } from "react-redux";

import { selectors } from "../reducers";
import { clickParcel, parcelRangeChange } from "../actions";

import ParcelsMap from "../components/ParcelsMap";

class ParcelsMapContainer extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = { x: 0, y: 0 }
    this.onMoveEnd = ({ bounds, position }) => {
      this.props.parcelRangeChange(
        Math.min(bounds.min.x, bounds.max.x),
        Math.max(bounds.min.x, bounds.max.x),
        Math.min(bounds.min.y, bounds.max.y),
        Math.max(bounds.min.y, bounds.max.y)
      )
      this.setState(position)
    }
    this.onClick = (x, y) => {
      this.props.clickParcel(x, y)
    }
  }

  componentWillMount() {
    this.props.parcelRangeChange(-5, 5, -4, 4)
  }

  render() {
    const coors = this.state.lat ? this.state : { x: 0, y : 0 }
    return <ParcelsMap
      {...coors}
      zoom={10}
      bounds={[[-25.5, -25.5], [25.5, 25.5]]}
      tileSize={128}
      onClick={this.onClick}
      onMoveEnd={this.onMoveEnd}
      parcelData={this.props.parcelStates}
      selectedData={this.props.selectedData}
    />
  }
}

export default connect(
  state => ({
    parcelStates: selectors.getParcelStates(state),
    selectedData: selectors.getSelectedLands(state)
  }),
  { parcelRangeChange, clickParcel }
)(ParcelsMapContainer);
