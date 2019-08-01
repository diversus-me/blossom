import { all } from 'redux-saga/effects'

import { loginSaga, loginLinkSaga } from './session/sagas'
import { addFlowerSaga, listFlowerSaga } from './flowerList/sagas'
import { getFlowerSaga, addNodeSaga } from './flowerData/sagas'

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
