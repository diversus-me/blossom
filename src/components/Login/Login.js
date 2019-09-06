import React from 'react'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import { requestLoginLink } from '../../state/session/actions'

import style from './Login.module.css'
import { Paper } from '@material-ui/core';
import Description from './Description';
import Input from './Input';
import SharedPaper from '../Share/SharePaper';
import Info from './Info';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      value: ''
    }
  }

  handleSubmit = (value) => {
    // e.preventDefault()
    const { session } = this.props
    if (!session.loginLinkLoading && !session.loginLinkSuccess) {
      this.props.requestLoginLink(value)
    }
  }


  render() {
    return [
      <div className={style.backgroundContainer} />,
      <div className={style.container}>
        <Grid container className={style.mainGrid}>
          <Grid item xs={12} sm={6} className={style.section}>
            <Description />
          </Grid>
          <Grid item xs={12} sm={6} className={style.section}>
            <SharedPaper children={
              // <Input
              //   handleSubmit={this.handleSubmit}
              // />
              <Info
                icon="/images/error.png"
                text1="Something went wrong."
                text2="Please try again."
              />
            } />
          </Grid>
        </Grid>

      </div>
    ]
  }
}

function mapStateToProps(state) {
  const { session } = state
  return { session }
}

const mapDispatchToProps = {
  requestLoginLink
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
