import types from "./types";
import { createSelector } from 'reselect'

const DX = [0, 1, 0, -1];
const DY = [1, 0, -1, 0];

const neighbors = item => {
  const results = []
  for (let i = 0; i < DX.length; i++) {
    results.push({ x: item.x - (-DX[i]), y: item.y - (-DY[i]) })
  }
  return results
}

export function selectedParcelsAreConnected(selectedParcels) {
  const selected = Object.keys(selectedParcels).filter(key => selectedParcels[key])
  const visited = {}
  const buildKey = parcel => `${parcel.x}, ${parcel.y}`
  const buildXYFromRegexMatch = regexMatch => ({ x: regexMatch[1], y: regexMatch[2] })
  const getCoors = key => buildXYFromRegexMatch(/(-?[0-9]+), ?(-?[0-9]+)/g.exec(key))
  const queue = []

  if (selected.length === 0) {
    return false
  }

  visited[selected[0]] = true
  queue.push(getCoors(selected[0]))

  while (queue.length !== 0) {
    const item = queue.pop()
    for (let neighbor of neighbors(item)) {
      const key = buildKey(neighbor)
      if (!visited[key] && selected.includes(key)) {
        visited[key] = true
        queue.push(neighbor)
      }
    }
  }
  return Object.keys(visited).length === selected.length
}

export function getBalance(state) {
  return state.balance
}

export const selectors = {
  getParcelStates: state => state.parcelStates,
  ethereumState: state => state.ethereum,
  balance: getBalance,
  getSelectedLands: state => state.balance.selected,
  selectedParcelsAreConnected: createSelector(getBalance, selectedParcelsAreConnected),
  display: state => ({
    x: state.displayMenu.x,
    y: state.displayMenu.y,
    parcel: state.parcelStates[`${state.displayMenu.x},${state.displayMenu.y}`],
    purchasing: state.displayMenu.purchasing
  })
};

const EDITOR_PATH = 'https://editor.decentraland.org';

function ethereum(state = { loading: true }, action) {
  switch (action.type) {
    case types.connectWeb3.request:
      return { loading: true };
    case types.connectWeb3.success:
      return { loading: false, success: true };
    case types.connectWeb3.failed:
      return { loading: false, error: action.error };
    default:
      return state;
  }
}

function balance(state = { selected: {} }, action) {
  let newSelected;
  switch (action.type) {
    case types.fetchBalance.request:
      return { ...state, loading: true, amount: 0 };
    case types.fetchBalance.loadedBalance:
      return { ...state, loading: false, amount: action.amount };
    case types.balanceParcel.success:
      return { ...state, parcels: action.parcels };
    case types.selectLand:
      newSelected = { ...state.selected };
      newSelected[action.id] = !newSelected[action.id];
      return { ...state, selected: newSelected };
    case types.balanceParcel.error:
      return { ...state, error: action.error };
    case types.fetchBalance.error:
      return { ...state, error: action.error };
    default:
      return state;
  }
}

function parcelStates(state = {}, action) {
  let newState;
  switch (action.type) {
    case types.loadParcel.request:
      return { ...state, loading: true };
    case types.loadParcel.success:
      newState = { ...state, loading: false };
      newState[`${action.parcel.x},${action.parcel.y}`] = action.parcel;
      return newState;
    case types.loadParcel.many:
      newState = { ...state, loading: false };
      action.parcels.forEach(parcel => {
        newState[`${parcel.x},${parcel.y}`] = parcel;
      });
      return newState;
    case types.loadParcel.failed:
      return { ...state, error: action.error };
    default:
      return state;
  }
}

function displayMenu(state = {}, action) {
  switch (action.type) {
    case types.click:
      return { x: action.x, y: action.y };
    case types.purchasingParcel:
      return { ...state, purchasing: true };
    case types.buyParcel.success:
      return { ...state, purchasing: false };
    case types.buyParcel.failed:
      return { ...state, purchasing: false };
    case types.launchEditor:
      window.open(`${EDITOR_PATH}/scene/new?parcels=${JSON.stringify(action.parcels)}`);
      return { ...state };
    default:
      return state;
  }
}

export default {
  ethereum,
  parcelStates,
  balance,
  displayMenu
};
