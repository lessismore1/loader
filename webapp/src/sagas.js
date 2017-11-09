import { takeEvery } from 'redux-saga'
import { call } from 'redux-saga/effects'
import types from './types'

import ethService from './ethereum'

export default function*() {
  yield takeEvery(types.buyParcel.request, buyParcel)
  yield takeEvery(types.parcelFetch.request, fetchParcel)
  yield takeEvery(types.launchEditor, launchEditor)
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
