import types from "./types";

// -------------------------------------------------------------------------
// Web3

export function connectWeb3(address) {
  return {
    type: types.connectWeb3.request,
    address
  };
}

// -------------------------------------------------------------------------
// Parcel States

export function parcelRangeChange(minX, maxX, minY, maxY) {
  return {
    type: types.parcelRangeChanged,
    minX, maxX,
    minY, maxY
  };
}

export function clickParcel(x, y) {
  return {
    type: types.click,
    x,
    y
  }
}

export function buyParcel(x, y) {
  return {
    type: types.buyParcel.request,
    x,
    y
  }
}
