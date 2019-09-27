import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createBrowserHistory } from 'history'

import rootReducer from './rootReducer'
import rootSaga from './rootSaga'

const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const history = createBrowserHistory()

export default function configureStore () {
  const store = createStore(
    rootReducer(history),
    composeEnhancers(applyMiddleware(sagaMiddleware))
  )
  sagaMiddleware.run(rootSaga)
  return store
}
