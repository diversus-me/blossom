import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  rounded: {
    padding: theme.spacing(3, 2),
    borderRadius: '20px'
  },

}));

export default function SharedPaper({ children }) {
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.rounded}>
        {children}
      </Paper>
    </div>
  );
}