import { put, takeEvery, takeLatest, all } from 'redux-saga/effects'
import { ADD_FLOWER_ERROR, ADD_FLOWER_LOADING, ADD_FLOWER_SUCCESS,
  LIST_FLOWER_ERROR, LIST_FLOWER_LOADING, LIST_FLOWER_SUCCESS, listFlowers } from '../actions/flowerList'

import fetchAsync from './fetchAsync'

function * addFlower (action) {
  try {
    yield fetchAsync(
      () => fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/flower`,
        {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(action.data)
        }
      ))
    yield all([put({ type: ADD_FLOWER_SUCCESS }), put(listFlowers())])
  } catch (e) {
    yield put({ type: ADD_FLOWER_ERROR, error: e.message })
  }
}

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

export function * addFlowerSaga () {
  yield takeEvery(ADD_FLOWER_LOADING, addFlower)
}

export function * listFlowerSaga () {
  yield takeLatest(LIST_FLOWER_LOADING, listFlower)
}
