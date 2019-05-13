import { put, takeEvery, takeLatest, all } from 'redux-saga/effects'
import { GET_FLOWER_LOADING, GET_FLOWER_SUCCESS, GET_FLOWER_ERROR,
        ADD_NODE_LOADING, ADD_NODE_ERROR, ADD_NODE_SUCCESS, getFlowerData } from '../actions/flowerData'

import fetchAsync from './fetchAsync'

function* getNode(action) {
    try {
        const response = yield fetchAsync(
            () => fetch(
                `${process.env.REACT_APP_SERVER_URL}/api/node/${action.id}`, 
                {
                    credentials: 'include',
                    method: 'GET'
                }
            ))
        yield put({type: GET_FLOWER_SUCCESS, data: response.data, connections: response.connections, id: action.id })
    } catch (e) {
        yield put({type: GET_FLOWER_ERROR, error: e.message, id: action.id})
    }
}

function* addNode(action) {
    try {
        const response = yield fetchAsync(
            () => fetch(
                `${process.env.REACT_APP_SERVER_URL}/api/node`, 
                {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(action.data)
                }
            ))
        yield all([put({type: ADD_NODE_SUCCESS, data: response.data, id: action.id }), put(getFlowerData(action.id))])
    } catch (e) {
        yield put({type: ADD_NODE_ERROR, error: e.message, id: action.id})
    }
}

export function* getFlowerSaga() {
    yield takeEvery(GET_FLOWER_LOADING, getNode)
}

export function* addNodeSaga() {
    yield takeLatest(ADD_NODE_LOADING, addNode)
}