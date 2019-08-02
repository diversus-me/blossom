import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { IoMdPerson, IoMdLogIn } from 'react-icons/io'

import style from './Hub.module.css'

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
        <div
          role='navigation'
          // onClick={this.toggleOverlay}
          className={style.iconContainer}
        >
          {session.authenticated &&
            <IoMdPerson
              size={25}
              color='white'
            />
          }
          {!session.authenticated && !session.loading &&
          <Link to='/login'>
            <IoMdLogIn
              size={25}
              color='white'
            />
          </Link>
          }
        </div>
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
