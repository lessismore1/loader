import { takeEvery, delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import types from './types'

import ethService from './ethereum'

export default function*() {
  yield call(connectWeb3)
  yield takeEvery(types.buyParcel.request, buyParcel)
  yield takeEvery(types.parcelFetch.request, fetchParcel)
  yield takeEvery(types.launchEditor, launchEditor)
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
    const txId = yield call(ethService.buyParcel(action.x, action.y))
  } catch(e) {
  }
}

export function* fetchParcel(action) {
  try {
    const txId = yield call(ethService.getParcelData(action.x, action.y))
  } catch(e) {
  }
}

export function* launchEditor(action) {
}
