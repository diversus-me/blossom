import { put, takeLatest } from 'redux-saga/effects'
import { LIST_FLOWER_ERROR, LIST_FLOWER_LOADING, LIST_FLOWER_SUCCESS } from './actions'

import { fetchAsync } from '../helpers'

function * listFlower (action) {
  try {
    const response = yield fetchAsync(
      () => fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/allFLowers`,
        {
          credentials: 'include',
          method: 'GET'
        }
      ))
    yield put({ type: LIST_FLOWER_SUCCESS, data: response.data })
  } catch (e) {
    yield put({ type: LIST_FLOWER_ERROR, error: e.message })
  }
}

export function * listFlowerSaga () {
  yield takeLatest(LIST_FLOWER_LOADING, listFlower)
}
