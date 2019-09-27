import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft'

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(30),
    left: theme.spacing(0),
    backgroundColor: theme.palette.secondary.main
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  button: {
    color: theme.palette.primary.main
  }
}))

export default function DrawerButtonLeft () {
  const classes = useStyles()

  return (
    <div>
      <Fab aria-label='add' className={classes.fab}>
        <ArrowLeft className={classes.button} />
      </Fab>
    </div>
  )
}
