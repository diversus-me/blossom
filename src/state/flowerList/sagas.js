import { put, takeEvery, takeLatest, all } from 'redux-saga/effects'
import { ADD_FLOWER_ERROR, ADD_FLOWER_LOADING, ADD_FLOWER_SUCCESS,
  LIST_FLOWER_ERROR, LIST_FLOWER_LOADING, LIST_FLOWER_SUCCESS, listFlowers } from './actions'

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
