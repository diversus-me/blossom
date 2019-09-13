import React from 'react'
import Appbar from '../UI/Appbar';
import ExpansionArea from '../UI/ExpansionArea';
import { Grid } from '@material-ui/core';
import FloatingActionButtons from '../UI/FloatingActionButtons';

export default function Home() {
  return (
    <div>
      <Appbar />
      <Grid container>
        <Grid item xs={12} sm={5} >
          <ExpansionArea />
          <FloatingActionButtons />
        </Grid>
      </Grid>
    </div>
  )
}
