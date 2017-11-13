import React from 'react';
import { connect } from 'react-redux';

import { selectors } from '../reducers';
import { selectLand, launchEditor } from '../actions';
import adjacencyTest from '../lib/AdjacencyTest';

class Balance extends React.Component {
  constructor (...args) {
    super(...args);
    this.onChanges = {};
    this.launchEditor = () =>
      this.props.launchEditor(
        Object.keys(this.props.selected).filter(key => this.props.selected[key])
      );
  }

  getOnChange (id) {
    if (!this.onChanges[id]) {
      this.onChanges[id] = ev => this.props.selectLand(id);
    }
    return this.onChanges[id];
  }

  get anySelected () {
    return Object.values(this.props.selected).reduce(
      (prev, next) => prev || next,
      false
    );
  }

  get validSelection () {
    const parcels = [];

    Object.keys(this.props.selected).map((key) => {
      const [x, y] = key.split(',').map((i) => parseInt(i, 10));

      if (this.props.selected[key]) {
        parcels.push({ x, y });
      }
    });

    return adjacencyTest(parcels);
  }

  renderBalance () {
    var action;

    if (this.anySelected && this.validSelection) {
      action = <div className='launch-editor'>
        {' '}
        <button onClick={this.launchEditor}>Launch Editor</button>
      </div>;
    } else if (this.anySelected) {
      action = <p>All parcels must be contiguous and share an edge (no diagonal parcels)</p>
    }

    return (
      <div>
        <div>Balance: {this.props.amount} LAND</div>
        <ul className='land-list'>{this.renderList()}</ul>
        { action }
      </div>
    );
  }

  renderList () {
    return this.props.parcels.map(parcel => {
      const id = `${parcel.x}, ${parcel.y}`;
      return (
        <li key={parcel.hash}>
          <input
            type='checkbox'
            checked={this.props.selected[id]}
            onChange={this.getOnChange(id)}
          />
          {parcel.x}, {parcel.y}
        </li>
      );
    });
  }

  render () {
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
