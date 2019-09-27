import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import { ConnectedRouter } from 'connected-react-router'

import theme from './theme'
import configureStore, { history } from './state/configureStore'
import App from './App'
import './index.css'

const store = configureStore()

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Router history={history}>
          <App />
        </Router>
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister()
