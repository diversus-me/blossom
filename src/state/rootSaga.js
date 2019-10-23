import { all } from 'redux-saga/effects'

import { loginSaga, loginLinkSaga } from './session/sagas'
import { listFlowerSaga } from './flowerList/sagas'
import { getFlowerSaga } from './flowerData/sagas'
import { addNodeSaga, editNodeSaga, addFlowerSaga, editFlowerSaga } from './globals/sagas'

export default function * rootSaga () {
  yield all([
    loginSaga(),
    loginLinkSaga(),
    addFlowerSaga(),
    listFlowerSaga(),
    getFlowerSaga(),
    addNodeSaga(),
    editNodeSaga(),
    editFlowerSaga()
  ])
}
