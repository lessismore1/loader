import { delay } from 'redux-saga'
import { select, takeEvery, call, put } from 'redux-saga/effects'
import types from './types'
import { selectors } from './reducers'

import ethService from './ethereum'

export default function*() {
  yield takeEvery(types.connectWeb3.request, connectWeb3)
  yield takeEvery(types.connectWeb3.success, fetchBalance)
  yield takeEvery(types.buyParcel.request, buyParcel)
  yield takeEvery(types.parcelRangeChanged, fetchBoard)
  yield takeEvery(types.loadParcel.request, fetchParcel)
  yield takeEvery(types.fetchBalance.request, fetchBalance)
  yield takeEvery(types.launchEditor, launchEditor)

  yield(put({ type: types.connectWeb3.request }))
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
    const result = yield call(async () => await ethService.buyParcel(action.x, action.y))
    if (result) {
      yield put({ type: ethService.buyParcel.success })
    } else {
      yield put({ type: ethService.buyParcel.failed })
    }
  } catch(error) {
    yield put({ type: ethService.buyParcel.failed, error })
  }
}

export function* fetchParcel(action) {
  try {
    const parcel = yield call(async () => await ethService.getParcelData(action.x, action.y))
    yield put({ type: types.loadParcel.success, parcel })
  } catch(error) {
    yield put({ type: types.loadParcel.failed, error })
  }
}

export function* fetchBalance(action) {
  const amount = yield call(async () => await ethService.getBalance())
  yield put({ type: types.fetchBalance.loadedBalance, amount })
  for (let i = 0; i < amount; i++) {
    try {
      const parcel = yield call(async () => await ethService.getOwnedParcel(i))
      yield put({ type: types.balanceParcel.success, parcel, index: i })
    } catch (error) {
      yield put({ type: types.balanceParcel.error, error })
    }
  }
}

export function* fetchBoard(action) {
  const state = yield select(selectors.ethereumState)
  if (!state.success) {
    return
  }
  const { minX, maxX, minY, maxY } = action
  const next = i => i <= 0 ? (-i) + 1 : (-i)
  const avgX = Math.floor((minX + maxX) / 2)
  const avgY = Math.floor((minY + maxY) / 2)
  for (let i = 0, x = 0; i++, x = next(x); minX + i <= maxX) {
   console.log(i, x)
   // for (let j = 0, y = 0; j++, y = next(y); minY + j <= maxY) {
   //   yield put({ type: types.loadParcel.request, x: x + avgX, y: y + avgY })
   //   try {
   //     const parcel = yield call(async () => await ethService.getParcelData(x + avgX, y + avgY))
   //     yield put({ type: types.loadParcel.success, parcel })
   //   } catch (error) {
   //     yield put({ type: types.loadParcel.failed, error })
   //   }
   // }
  }
}

export function* launchEditor(action) {
}
