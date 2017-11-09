import React from "react";
import { connect } from "react-redux";

import { selectors } from "../reducers";
import { selectLand, launchEditor } from "../actions";

class Balance extends React.Component {
  constructor(...args) {
    super(...args);
    this.onChanges = {};
    this.launchEditor = () =>
      this.props.launchEditor(
        Object.keys(this.props.selected).filter(key => this.props.selected[key])
      );
  }
  getOnChange(id) {
    if (!this.onChanges[id]) {
      this.onChanges[id] = ev => this.props.selectLand(id);
    }
    return this.onChanges[id];
  }
  renderBalance() {
    const renderLaunch = Object.values(this.props.selected).reduce(
      (prev, next) => prev || next,
      false
    );
    return (
      <div>
        <div>Balance: {this.props.amount} LAND</div>
        <ul className="land-list">{this.renderList()}</ul>
        {renderLaunch && (
          <div className="launch-editor">
            {" "}
            <button onClick={this.launchEditor}>Launch Editor</button>
          </div>
        )}
      </div>
    );
  }
  renderList() {
    return this.props.parcels.map(parcel => {
      const id = `${parcel.x}, ${parcel.y}`;
      return (
        <li key={parcel.hash}>
          <input
            type="checkbox"
            checked={this.props.selected[id]}
            onChange={this.getOnChange(id)}
          />
          {parcel.x}, {parcel.y}
        </li>
      );
    });
  }
  render() {
    if (this.props.loading) {
      return <div>Loading balance...</div>;
    }
    if (
      this.props.amount > 0 &&
      this.props.parcels &&
      this.props.parcels.length
    ) {
      return this.renderBalance();
    }
    return (
      <div>
        <strong>Loading balance...</strong>
      </div>
    );
  }
}
export default connect(selectors.balance, { selectLand, launchEditor })(
  Balance
);
