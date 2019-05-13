import { put, takeEvery, takeLatest } from 'redux-saga/effects'
import { LOGIN_LOADING, LOGIN_SUCCESS, LOGIN_ERROR,
        LOGIN_LINK_LOADING, LOGIN_LINK_SUCCESS, LOGIN_LINK_ERROR } from '../actions/session'

import fetchAsync from './fetchAsync'

function* login(action) {
    try {
        yield fetchAsync(
            () => fetch(
                `${process.env.REACT_APP_SERVER_URL}/api/checkLogin`, 
                { credentials: 'include'}
            ))
        yield put({type: LOGIN_SUCCESS})
    } catch (e) {
        if (!action.token) {
            yield put({type: LOGIN_ERROR, error: e.message})
        } else {
            try {
                yield fetchAsync(
                    () => fetch(
                        `${process.env.REACT_APP_SERVER_URL}/api/login?token=${action.token}`, 
                        { credentials: 'include'}
                    ))
                    yield put({type: LOGIN_SUCCESS, token: true})
            } catch (e) {
                yield put({type: LOGIN_ERROR, error: e.message, token: true})
            }
        }
    }
}

export function* loginSaga() {
    yield takeEvery(LOGIN_LOADING, login);
}

function* getLoginLink(action) {
    try {
        yield fetchAsync(
            () => fetch(
                `${process.env.EACT_APP_SERVER_URL}/api/requestLoginLink`, 
                {
                    credentials: 'include',
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email: action.email}),
                }
            ))
        yield put({type: LOGIN_LINK_SUCCESS})
    } catch (e) {
        yield put({type: LOGIN_LINK_ERROR, message: e.message})
    }
}

export function* loginLinkSaga() {
    yield takeLatest(LOGIN_LINK_LOADING, getLoginLink);
}