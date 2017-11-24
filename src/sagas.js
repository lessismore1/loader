import { env } from "decentraland-commons";
import { delay } from "redux-saga";
import {
  race,
  take,
  select,
  takeEvery,
  call,
  put,
  fork
} from "redux-saga/effects";
import types from "./types";

import ethService from "./ethereum";

env.load();
const EDITOR_URL = env.get(
  "REACT_APP_EDITOR_URL",
  "https://editor.decentraland.today"
);

export default function*() {
  yield takeEvery(types.connectWeb3.request, connectWeb3);
  yield takeEvery(types.connectWeb3.success, fetchBalance);
  yield takeEvery(types.buyParcel.request, buyParcel);
  yield takeEvery(types.parcelRangeChanged, fetchBoard);
  yield takeEvery(types.loadParcel.request, fetchParcel);
  yield takeEvery(types.buyParcel.success, fetchParcel);
  yield takeEvery(types.fetchBalance.request, fetchBalance);
  yield takeEvery(types.launchEditor, launchEditor);

  yield fork(initialLoad);
  yield put({ type: types.connectWeb3.request });
}

export function* initialLoad() {
  let { connected, moved } = yield race({
    connected: take(types.connectWeb3.success),
    moved: take(types.parcelRangeChanged)
  });
  if (!connected) {
    connected = yield take(types.connectWeb3.success);
  } else {
    moved = yield take(types.parcelRangeChanged);
  }
  fetchBalance(moved);
}

export function* connectWeb3() {
  try {
    let retries = 0;
    let connected = yield call(async () => await ethService.init());

    while (!connected && retries < 3) {
      yield delay(1000);
      connected = yield call(async () => await ethService.init());
      retries += 1;
    }
    if (!connected) throw new Error("Could not connect to web3");
    yield put({ type: types.connectWeb3.success, web3Connected: true });
  } catch (error) {
    console.error(error);
    yield put({ type: types.connectWeb3.failed, message: error.message });
  }
}

export function* buyParcel(action) {
  try {
    yield put({ type: types.purchasingParcel });
    const result = yield call(
      async () => await ethService.buyParcel(action.x, action.y)
    );
    if (result) {
      yield fetchParcel({ x: action.x, y: action.y });
      yield fetchBalance();
      yield put({ type: types.buyParcel.success, x: action.x, y: action.y });
    } else {
      yield put({ type: types.buyParcel.failed });
    }
  } catch (error) {
    yield put({ type: types.buyParcel.failed, error: error.message });
  }
}

export function* fetchParcel(action) {
  try {
    const parcel = yield call(
      async () => await ethService.getParcelData(action.x, action.y)
    );
    yield put({ type: types.loadParcel.success, parcel });
  } catch (error) {
    yield put({ type: types.loadParcel.failed, error });
  }
}

export function* fetchBalance(action) {
  try {
    const amount = yield call(async () => await ethService.getBalance());
    yield put({ type: types.fetchBalance.loadedBalance, amount });
  } catch (error) {
    yield put({
      type: types.fetchBalance.failed,
      error: error.message,
      stack: error.stack
    });
    return;
  }
  try {
    const parcels = yield call(async () => await ethService.getOwnedParcels());
    yield put({ type: types.balanceParcel.success, parcels });
  } catch (error) {
    yield put({
      type: types.balanceParcel.failed,
      error: error.message,
      stack: error.stack
    });
  }
}

export function* fetchBoard(action) {
  let status = yield select(state => state.ethereum);
  while (!status.success) {
    yield delay(2000);
    status = yield select(state => state.ethereum);
  }
  const { minX, maxX, minY, maxY } = action;
  const next = i => (i <= 0 ? -i + 1 : -i);
  const avgX = Math.floor((minX + maxX) / 2);
  const avgY = Math.floor((minY + maxY) / 2);
  const parcels = [];
  for (let i = 0, x = 0; i <= maxX - minX + 1; i++, x = next(x)) {
    for (let j = 0, y = 0; j <= maxY - minY + 1; j++, y = next(y)) {
      parcels.push({ x: x + avgX, y: y + avgY });
    }
  }
  try {
    const result = yield call(async () => await ethService.getMany(parcels));
    yield put({ type: types.loadParcel.many, parcels: result });
  } catch (error) {
    yield put({ type: types.loadParcel.failed, error: error.message });
  }
}

export function* launchEditor(action) {
  const coordinates = action.parcels.join(';')
  yield window.open(
    `${EDITOR_URL}/scene/new?parcels=${coordinates}`
  );
}
