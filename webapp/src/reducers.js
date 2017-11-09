import types from "./types";

export const selectors = {
  getParcelStates: state => state.parcelStates,
  ethereumState: state => state.ethereum,
  balance: state => state.balance,
  getSelectedLands: state => state.balance.selected,
  display: state => ({
    x: state.displayMenu.x,
    y: state.displayMenu.y,
    parcel: state.parcelStates[`${state.displayMenu.x},${state.displayMenu.y}`]
  })
};

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
