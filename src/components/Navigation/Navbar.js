import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircleSharp'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Badge from '@material-ui/core/Badge'

import Logo from '../UI/Logo'

import { NAVBAR_HEIGHT } from '../Defaults'

import style from './Navbar.module.css'

class Navbar extends React.Component {
  render () {
    return (
      <div className={style.bar} style={{ height: NAVBAR_HEIGHT }}>
        <div className={style.logoContainer}>
          <Logo
            height={20}
            shortenAtWidthOf={600}
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
