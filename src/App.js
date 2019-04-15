import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import './App.css'

import Navigation from './components/Navigation'
import FlowerView from './components/FlowerView'

class App extends Component {
  render() {
    const { flowers } = this.props
    return (
      <Router>
        <Route render={({ location }) => (
          <div>
          <Navigation />
          <TransitionGroup>
            <CSSTransition
              classNames={'fade'}
              timeout={{ enter: 500, exit: 500 }}
              key={location.pathname}
            >
              <Switch location={location}>
                {flowers && flowers.map((flower) => 
                  <Route
                    key={location.pathname}
                    path={`/${flower.title}`}
                    render={() =>
                      <FlowerView
                        key={location.pathname}
                        title={flower.title}
                        data={flower.data}
                        sorted={flower.sorted}
                        min={flower.min}
                        max={flower.max}
                        search={location.search}
                      />
                    }
                  />
                )}
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </div>
        )}>
        </Route>
      </Router>
    )
  }
}

function mapStateToProps(state) {
  const { flowers } = state
  return { flowers }
}

export default connect(mapStateToProps)(App)
