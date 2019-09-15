import React from 'react'
import Appbar from '../UI/Appbar'
import ExpansionArea from '../UI/ExpansionArea'
import { Grid } from '@material-ui/core'
import FloatingActionButtons from '../UI/FloatingActionButtons'
import DrawerButtonRight from '../UI/DrawerButtonRight'
import DrawerButtonLeft from '../UI/DrawerButtonLeft'
import FlowerRenderer from '../Flower/FlowerRenderer'

export default function Home () {
  return (
    <div>
      <Appbar />
      <Grid container>
        <Grid item xs={12} sm={5} >
          <ExpansionArea />
        </Grid>
      </Grid>
      <FloatingActionButtons />
      <DrawerButtonRight />
      <DrawerButtonLeft />
    </div>
  )
}
