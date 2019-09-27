import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1),
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(5),
    backgroundColor: theme.palette.secondary.main
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  button: {
    color: theme.palette.primary.main
  }
}))

export default function FloatingActionButtons() {
  const classes = useStyles()

  return (
    <div>
      <Fab aria-label='add' className={classes.fab}>
        <AddIcon className={classes.button} />
      </Fab>
    </div>
  )
}
