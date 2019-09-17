import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircleSharp'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Badge from '@material-ui/core/Badge'

import Logo from '../UI/Logo'

import style from './Navbar.module.css'

class Navbar extends React.Component {
  mediaQuery = window.matchMedia('(max-width: 600px)')
  state = {
    short: this.mediaQuery.matches
  }

  componentDidMount () {
    this.mediaQuery.addListener(this.queryChanged)
  }

  componentWillUnmount () {
    this.mediaQuery.removeListener(this.queryChanged)
  }

  queryChanged = (e) => {
    this.setState({
      short: e.matches
    })
  }

  render () {
    return (
      <div className={style.bar}>
        <div className={style.logoContainer}>
          <Logo
            height={25}
            short={this.state.short}
          />
        </div>
        <div className={style.iconContainer}>
          <IconButton disabled aria-label='show 17 new notifications'>
            <Badge badgeContent={0} color='error'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            disabled
            edge='end'
            aria-label='account of current user'
            aria-haspopup='true'
          >
            <AccountCircle />
          </IconButton>
        </div>
      </div>
    )
  }
}

export default Navbar
