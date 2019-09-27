import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import ArrowRight from '@material-ui/icons/KeyboardArrowRight'

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(30),
    right: theme.spacing(0),
    backgroundColor: theme.palette.secondary.main

  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  button: {
    color: theme.palette.primary.main
  }
}))

export default function DrawerButtonRight () {
  const classes = useStyles()

  return (
    <div>
      <Fab aria-label='add' className={classes.fab}>
        <ArrowRight className={classes.button} />
      </Fab>
    </div>
  )
}
