import { all } from 'redux-saga/effects'

import { loginSaga, loginLinkSaga } from './sagas/sessionSagas'
import { addFlowerSaga, listFlowerSaga } from './sagas/flowerListSaga'
import { getFlowerSaga, addNodeSaga } from './sagas/flowerDataSaga'

export default function * rootSaga () {
  yield all([
    loginSaga(),
    loginLinkSaga(),
    addFlowerSaga(),
    listFlowerSaga(),
    getFlowerSaga(),
    addNodeSaga()
  ])
}
