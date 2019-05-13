import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import queryString from 'query-string'

import './App.css'

import { login } from './state/actions/session'

import FloatingButton from './components/FloatingButton'
import Navigation from './components/Navigation'
import Login from './components/Login/Login'
import FlowerView from './components/FlowerView'
import LoginLoader from './components/Login/LoginLoader'
import Overlay from './components/Overlay'
import AddFlowerForm from './components/AddFlowerForm'
import AddNodeForm from './components/AddNodeForm'

class App extends Component {

  constructor(props) {
    super(props)
    this.toggleAddFlowerOverlay = this.toggleAddFlowerOverlay.bind(this)
    this.state = {
      flowerOverlayVisible: false
    }
  }

  componentDidMount() {
    toast.configure({
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true
    })

    if (!this.props.session.authenticated) {
      const parsedQuery = queryString.parse(this.props.location.search)
  
      if (parsedQuery.token) {
        this.props.login(parsedQuery.token)
        const location = window.location.toString()
        window.history.replaceState({}, document.title, location.substring(0, location.indexOf("?")))
      } else {
        this.props.login()
      }
    }
  }

  componentDidUpdate(nextProps) {
    if (this.props.session.failed && this.props.location.pathname !== '/login') {
      this.props.history.push('/login')
    }

    if (this.props.session.authenticated && this.props.location.pathname === '/login') {
      this.props.history.push('/')
    }
  }

  toggleAddFlowerOverlay(e) {
    this.setState({
      flowerOverlayVisible: !this.state.flowerOverlayVisible
    })
  }

  render() {
    const { flowerList, session } = this.props
    const { flowerOverlayVisible } = this.state
  
    return (
        <Route render={({ location }) => (
          <div>
            {session.loading &&
              <LoginLoader />
            }
          <Switch location={location}>
            {session.authenticated &&
              <Route path='/' component={Navigation}/>
            }
            <Route path='/login' exact render={() =>
              <Login />
            }/>
          </Switch>
          <TransitionGroup>
            <CSSTransition
              classNames={'fade'}
              timeout={{ enter: 500, exit: 500 }}
              key={location.pathname}
            >
              <Switch location={location}>
                {flowerList.list && flowerList.list.map((flower) => 
                  <Route
                    key={flower.node.id}
                    path={`/flower/${flower.node.id}`}
                    render={() =>
                      <FlowerView
                        key={flower.node.id}
                        id={flower.node.id}
                        // title={flower.title}
                        // data={flower.data}
                        // sorted={flower.sorted}
                        // min={flower.min}
                        // max={flower.max}
                        // search={location.search}
                      />
                    }
                  />
                )}
              </Switch>
            </CSSTransition>
          </TransitionGroup>
          <FloatingButton
            onClickCallback={this.toggleAddFlowerOverlay}
          />
          <Overlay
            visibility={flowerOverlayVisible}
            onOuterClick={this.toggleAddFlowerOverlay}
          >
            <AddFlowerForm />
          </Overlay>
        </div>
        )}>
        </Route>
    )
  }
}

function mapStateToProps(state) {
  const { flowerList, session } = state
  return { flowerList, session }
}

const mapDispatchToProps = {
  login
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
