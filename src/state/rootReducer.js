import { combineReducers } from 'redux'

import flowerData from './flowerData/reducer'
import flowerList from './flowerList/reducer'
import session from './session/reducer'
import dimensions from './dimensions/reducer'
import globals from './globals/reducer'

export default combineReducers({
  flowerList,
  flowerData,
  session,
  dimensions,
  globals
})
