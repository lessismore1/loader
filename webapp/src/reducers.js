import types from "./types";

export const selectors = {
  getParcelStates: state => state.parcelStates,
  ethereumState: state => state.ethereum,
  balance: state => state.balance
}

function ethereum(state = { loading: true }, action) {
  switch (action.type) {
    case types.connectWeb3.request:
      return { loading: true }
    case types.connectWeb3.success:
      return { loading: false, success: true }
    case types.connectWeb3.failed:
      return { loading: false, error: action.error }
    default:
      return state
  }
}

function balance(state = {}, action) {
  switch (action.type) {
    case types.fetchBalance.request:
      return { loading: true, amount: 0 }
    case types.fetchBalance.loadedBalance:
      return { loading: false, amount: action.amount, parcels: {}, loaded: 0 }
    case types.balanceParcel.success:
      return { ...state,
        loaded: state.loaded + 1,
        parcels: Object.assign({}, state.parcels, action.parcel.hash: action.parcel)
      }
    case types.balanceParcel.error:
      return { ...state,
        parcels: Object.assign({}, state.parcels, action.parcel.hash: { error: action.error })
      }
    case types.fetchBalance.error:
      return { ...state,
        error: action.error
      }
    default:
      return state
  }
}

function parcelStates(state = {}, action) {
  switch (action.type) {
    case types.loadParcel.request:
      return { ...state, [`${action.parcel.x},${action.parcel.y}`]: { loading: true } }
    case types.loadParcel.many:
      const newState = {...state}
      action.parcels.forEach(parcel => {
        newState[`${parcel.x},${parcel.y}`] = parcel
      })
      return newState
    case types.loadParcel.success:
      return { ...state, [`${action.parcel.x},${action.parcel.y}`]: action.parcel }
    case types.loadParcel.failed:
      return { ...state, [`${action.parcel.x},${action.parcel.y}`]: { error: action.error } }
    default:
      return state
  }
}

export default {
  ethereum,
  parcelStates,
  balance
}
