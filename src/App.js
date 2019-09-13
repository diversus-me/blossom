import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom' // eslint-disable-line no-unused-vars
import { toast } from 'react-toastify'
import queryString from 'query-string'

import 'react-toastify/dist/ReactToastify.css'

import { login } from './state/session/actions'
import { resize } from './state/dimensions/actions'

import FloatingButton from './components/UI/FloatingButton'
import Overlay from './components/UI/Overlay'
// import AddFlowerForm from './components/Forms/AddFlowerForm'
import Navigation from './components/Navigation/Navigation'
import Login from './components/Login/Login'
import Hub from './components/User/Hub'
import AdminArea from './components/Admin/AdminArea'
import FlowerView from './components/FlowerView'
import Home from './components/Home/Home';

// import style from './App.module.css'

class App extends Component {
  state = {
    flowerOverlayVisible: false
  }

  componentDidMount() {
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
        window.history.replaceState({}, document.title, location.substring(0, location.indexOf('?')))
      } else {
        this.props.login()
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.props.resize)
  }

  toggleAddFlowerOverlay = () => {
    this.setState({
      flowerOverlayVisible: !this.state.flowerOverlayVisible
    })
  }

  render() {
    const { session } = this.props
    const { flowerOverlayVisible } = this.state
    return (
      <Route render={({ location }) => (
        <div>
          <Switch location={location}>
            <Route path='/' exact component={Navigation} />
            <Route path='/admin' exact component={AdminArea} />
            <Route path='/home' exact component={Home} />
            <Route
              path='/login'
              exact
              render={() =>
                <Login />
              } />
          </Switch>
          {/* <Hub /> */}
          {location.pathname.startsWith('/flower') && location.pathname.slice(8) &&
            <FlowerView
              id={location.pathname.slice(8)}
            />
          }
          {!session.authenticated && location.pathname.slice(8) && false &&
            <h2 style={{
              textAlign: 'center', top: '40%', position: 'absolute', width: '100%'
            }}>
              Please log in to see content.
          </h2>
          }
          {session.authenticated &&
            <Route path='/' exact render={() =>
              <FloatingButton
                onClickCallback={this.toggleAddFlowerOverlay}
              />
            } />
          }
          <Overlay
            visibility={flowerOverlayVisible}
            onOuterClick={this.toggleAddFlowerOverlay}
          >
            {/* <AddFlowerForm /> */}
          </Overlay>
        </div>
      )} />
    )
  }
}

function mapStateToProps(state) {
  const { session } = state
  return { session }
}

const mapDispatchToProps = {
  login, resize
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
