import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import style from './Hub.module.css'

import RandomUserImage from '../Dummies/RandomUserImage'
import Overlay from '../UI/Overlay'

class Hub extends React.Component {
  state = {
    overlayVisibility: false
  }

  toggleOverlay = () => {
    this.setState({
      overlayVisibility: !this.state.overlayVisibility
    })
  }

  render () {
    const { session } = this.props
    const { overlayVisibility } = this.state
    return [
      <div className={style.container} key='icon'>
        {session.authenticated &&
        <div
          role='navigation'
          onClick={this.toggleOverlay}
          className={style.iconContainer}
        >
          <RandomUserImage round />
        </div>
        }
        {!session.authenticated && !session.loading &&
        <Link to='/login'>
          <button className={style.loginButton} >Login</button>
        </Link>
        }
      </div>,
      <Overlay
        key='overlay'
        onOuterClick={this.toggleOverlay}
        visibility={overlayVisibility}
      >
        <div style={{ height: '9000px' }} />
      </Overlay>
    ]
  }
}

function mapStateToProps (state) {
  const { session } = state
  return { session }
}

// const mapDispatchToProps = {
//   login
// }

export default connect(mapStateToProps)(Hub)
