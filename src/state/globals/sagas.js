import { put, takeLatest, all } from 'redux-saga/effects'
import { EDIT_NODE_LOADING, EDIT_NODE_ERROR, EDIT_NODE_SUCCESS,
  ADD_NODE_LOADING, ADD_NODE_ERROR, ADD_NODE_SUCCESS,
  ADD_FLOWER_LOADING, ADD_FLOWER_SUCCESS, ADD_FLOWER_ERROR,
  EDIT_FLOWER_LOADING, EDIT_FLOWER_ERROR, EDIT_FLOWER_SUCCESS } from './actions'
import { listFlowers } from '../flowerList/actions'

import { getFlowerData } from '../flowerData/actions'

import { fetchAsync } from '../helpers'

function * addNode (action) {
  try {
    const response = yield fetchAsync(
      () => fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/node`,
        {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(action.data)
        }
      ))
    yield all([
      put({ type: ADD_NODE_SUCCESS, data: response.data, id: action.id }),
      put(getFlowerData(action.id))
    ])
  } catch (e) {
    yield put({ type: ADD_NODE_ERROR, error: e.message, id: action.id })
  }
}

export function * addNodeSaga () {
  yield takeLatest(ADD_NODE_LOADING, addNode)
}

function * editNode (action) {
  try {
    const response = yield fetchAsync(
      () => fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/node`,
        {
          credentials: 'include',
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(action.data)
        }
      ))
    yield all([
      put({ type: EDIT_NODE_SUCCESS, data: response.data, id: action.id }),
      put(getFlowerData(action.id))
    ])
  } catch (e) {
    yield put({ type: EDIT_NODE_ERROR, error: e.message, id: action.id })
  }
}

export function * editNodeSaga () {
  yield takeLatest(EDIT_NODE_LOADING, editNode)
}

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

export function * addFlowerSaga () {
  yield takeLatest(ADD_FLOWER_LOADING, addFlower)
}

function * editFlower (action) {
  try {
    yield fetchAsync(
      () => fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/flower`,
        {
          credentials: 'include',
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(action.data)
        }
      ))
    yield all([put({ type: EDIT_FLOWER_SUCCESS }), put(listFlowers())])
  } catch (e) {
    yield put({ type: EDIT_FLOWER_ERROR, error: e.message })
  }
}

export function * editFlowerSaga () {
  yield takeLatest(EDIT_FLOWER_LOADING, editFlower)
}
