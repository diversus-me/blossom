import { combineReducers } from 'redux'

import flowerData from './reducers/flowerDataReducer'
import flowerList from './reducers/flowerListReducer'
import settings from './reducers/settingReducer'
import session from './reducers/sessionReducer'

export default combineReducers({flowerList, flowerData, settings, session})