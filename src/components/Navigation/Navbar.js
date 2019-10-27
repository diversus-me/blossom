import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircleSharp'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Badge from '@material-ui/core/Badge'

import Logo from '../UI/Logo'

import { NAVBAR_HEIGHT } from '../../Defaults'

import style from './Navbar.module.css'

function Navbar (props) {
  const { session } = props
  return (
    <div className={style.bar} style={{ height: NAVBAR_HEIGHT }}>
      <div className={style.logoContainer}>
        <Logo
          height={20}
          shortenAtWidthOf={600}
        />
      </div>
      <div className={style.iconContainer}>
        {session.authenticated &&
        [
          <IconButton disabled aria-label='show 17 new notifications'>
            <Badge badgeContent={0} color='error'>
              <NotificationsIcon />
            </Badge>
          </IconButton>,
          <IconButton
            disabled
            edge='end'
            aria-label='account of current user'
            aria-haspopup='true'
          >
            <AccountCircle />
          </IconButton>
        ]
        }
        {!session.authenticated &&
        <Link
          to={`/login`}
          className={style.login}
        >
          Login
        </Link>
        }
      </div>
    </div>
  )
}

function mapStateToProps (state) {
  const { session } = state
  return { session }
}

export default connect(mapStateToProps)(Navbar)
