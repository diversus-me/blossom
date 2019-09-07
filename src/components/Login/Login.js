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

 const InfoMessage = (message) => {
   switch(message) {
     case "error" : 
       return <Info
         icon="/images/error.png"
         text1="Something went wrong."
         text2="Please try again."
       />
       case "Success" :
       return <Info
         icon="/images/error.png"
         text1="Successfull."
         text2="Please try again."
       />
   }
 }

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      value: '',
      isInfoMessage: false
    }
  }

  handleSubmit = (value) => {
    const { session } = this.props
    if (!session.loginLinkLoading && !session.loginLinkSuccess) {
      this.props.requestLoginLink(value)
      this.setState({
        isInfoMessage : true,
        message : "error"
      })
    }
    else {
      this.setState({
        isInfoMessage: true,
        message: "success"
      })
    }
  }


  render() {
    const {message} = this.state;
    return [
      <div className={style.backgroundContainer} />,
      <div className={style.container}>
        <Grid container className={style.mainGrid}>
          <Grid item xs={12} sm={6} className={style.section}>
            <Description />
          </Grid>
          <Grid item xs={12} sm={6} className={style.section}>
            <SharedPaper children={
              (!this.state.isInfoMessage) ? (
                <Input
                  handleSubmit={this.handleSubmit}
                />
              ) : (
                InfoMessage("error")
                )
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
