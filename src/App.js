import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import style from './App.module.css'
import './App.css'
import FlowerItem from './components/FlowerItem/FlowerItem'
import FlowerViewer from './components/FlowerViewer'

class App extends Component {
  render() {
    const { flowers } = this.props
    return (
      <Router>
        <Route render={({ location }) => (
          <div className="App">
          <div id="header">
            <h1>blossom</h1>
          </div>
          <div className="content">
            {flowers && flowers.map((flower) => {
              return(
                <Link to={`/${flower.title}`} key={flower.title}>
                  <FlowerItem
                    title={flower.title}
                  />
                </Link>
              )
            })}
          </div>
          <TransitionGroup>
            <CSSTransition
              key={location.key}
              classNames={'fade'}
              timeout={{ enter: 500, exit: 500 }}
            >
              <Switch location={location}>
                {flowers && flowers.map((flower) => 
                  <Route
                    key={flower.title}
                    path={`/${flower.title}/`}
                    render={() =>
                      <FlowerViewer
                        title={flower.title}
                        data={flower.data}
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
    );
  }
}

function mapStateToProps(state) {
  const { flowers, settings, dispatch } = state
  return { flowers, settings, dispatch }
}

export default connect(mapStateToProps)(App)
