import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route, Switch } from 'react-router' // eslint-disable-line no-unused-vars
import { toast } from 'react-toastify'
import queryString from 'query-string'

import 'react-toastify/dist/ReactToastify.css'

import { login } from './state/session/actions'
import { resize } from './state/dimensions/actions'

import FloatingButton from './components/UI/FloatingButton'
import Navigation from './components/Navigation/Navigation'
import Login from './components/Login/Login'
import AdminArea from './components/Admin/AdminArea'
import FlowerView from './components/FlowerView'
// import FlowerRoutine from './components/Routines/FlowerRoutine'

import Home from './components/Home/Home'

const MOBILE_BREAKPOINT = 1200

class App extends Component {
  static getDerivedStateFromProps (props, state) {
    const { dimensions, globals } = props
    const { selectedFlower } = globals
    if (state.selectedFlower !== selectedFlower) {
      let sideBarOpen = state.sideBarOpen
      if (dimensions.width < MOBILE_BREAKPOINT) {
        // Close the Sidebar on mobile
        sideBarOpen = false
      }
      return {
        sideBarOpen,
        selectedFlower
      }
    }
    return {
      selectedFlower
    }
  }

  state = {
    flowerOverlayVisible: false,
    sideBarOpen: this.props.dimensions.width > MOBILE_BREAKPOINT,
    selectedFlower: this.props.globals.selectedFlower
  };

  componentDidMount () {
    window.addEventListener('resize', this.props.resize)
    toast.configure({
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true
    })

    if (!this.props.session.authenticated) {
      const parsedQuery = queryString.parse(this.props.location.search)

      if (parsedQuery.token) {
        this.props.login(parsedQuery.token)
        const location = window.location.toString()
        window.history.replaceState(
          {},
          document.title,
          location.substring(0, location.indexOf('?'))
        )
      } else {
        this.props.login()
      }
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.props.resize)
  }

  toggleSideBar = () => {
    this.setState({
      sideBarOpen: !this.state.sideBarOpen
    })
  };

  toggleAddFlowerOverlay = () => {
    this.setState({
      flowerOverlayVisible: !this.state.flowerOverlayVisible
    })
  };

  render () {
    const { session, globals } = this.props
    const { sideBarOpen } = this.state
    return (
      <Route
        render={({ location }) => (
          <div>
            <Switch location={location}>
              <Route path='/admin' exact component={AdminArea} />
              <Route path='/home' exact component={Home} />
              <Route path='/login' exact render={() => <Login />} />
              <Route
                render={() => (
                  <Navigation
                    sideBarOpen={sideBarOpen}
                    toggleSideBar={this.toggleSideBar}
                  >
                    {globals.selectedFlower && (
                      <FlowerView
                        id={globals.selectedFlower}
                        sideBarOpen={sideBarOpen}
                      />
                    )}
                  </Navigation>
                )}
              />
            </Switch>
            {session.authenticated && (
              <Route
                path='/'
                exact
                render={() => (
                  <FloatingButton
                    onClickCallback={this.toggleAddFlowerOverlay}
                  />
                )}
              />
            )}
            {/* {(globals.addFlowerRoutineRunning || globals.editFlowerRoutineRunning) &&
            <div>
              <FlowerRoutine />
            </div>
            } */}
          </div>
        )}
      />
    )
  }
}

function mapStateToProps (state) {
  const { session, globals, dimensions } = state
  return { session, globals, dimensions }
}

const mapDispatchToProps = {
  login,
  resize
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
)
