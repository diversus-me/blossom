import { put, takeEvery } from 'redux-saga/effects'
import { GET_FLOWER_LOADING, GET_FLOWER_SUCCESS, GET_FLOWER_ERROR } from './actions'

import { fetchAsync } from '../helpers'

function * getNode (action) {
  try {
    const response = yield fetchAsync(
      () => fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/node/${action.id}`,
        {
          credentials: 'include',
          method: 'GET'
        }
      ))
    yield put({
      type: GET_FLOWER_SUCCESS,
      data: response.data,
      connections: response.connections,
      id: action.id
    })
  } catch (e) {
    yield put({ type: GET_FLOWER_ERROR, error: e.message, id: action.id })
  }
}

export function * getFlowerSaga () {
  yield takeEvery(GET_FLOWER_LOADING, getNode)
}
