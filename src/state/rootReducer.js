import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import flowerData from './flowerData/reducer'
import flowerList from './flowerList/reducer'
import session from './session/reducer'
import dimensions from './dimensions/reducer'
import { connectGlobals } from './globals/reducer'

export default (history) => combineReducers({
  router: connectRouter(history),
  flowerList,
  flowerData,
  session,
  dimensions,
  globals: connectGlobals(history)
})
