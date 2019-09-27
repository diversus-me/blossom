import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import flowerData from './flowerData/reducer'
import flowerList from './flowerList/reducer'
import session from './session/reducer'
import dimensions from './dimensions/reducer'
import globals from './globals/reducer'
import flower from './flower/reducer'

export default (history) => combineReducers({
  router: connectRouter(history),
  flowerList,
  flowerData,
  session,
  dimensions,
  globals,
  flower
})
