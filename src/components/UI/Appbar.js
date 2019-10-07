import React from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircleSharp'
import NotificationsIcon from '@material-ui/icons/Notifications'


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff'
  },
  grow: {
    flexGrow: 1
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('xs')]: {
      display: 'block'
    }
  },
  icon: {
    color: theme.palette.secondary.light
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  }
}))

export default function Appbar () {
  const classes = useStyles()

  const menuId = 'primary-search-account-menu'

  return (
    <div className={classes.grow}>
      <AppBar
        position='static'
        color='inherit'
        className={classes.icon}
      >
        <Toolbar>
          <Typography className={classes.title} variant='h6' noWrap>
            diversus
          </Typography>
          <h2>diversus</h2>
          <div className={classes.grow} />
          <div>
            <IconButton aria-label='show 4 new mails' className={classes.icon}>
              <SearchIcon />
            </IconButton>
            <IconButton aria-label='show 17 new notifications' className={classes.icon}>
              <Badge badgeContent={17} color='error'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              className={classes.icon}
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}
