import React from 'react'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import { requestLoginLink } from '../../state/session/actions'

import style from './Login.module.css'

import Description from './Description'
import Input from './Input'
import Info from './Info'
import Logo from '../UI/Logo'

class Login extends React.Component {
  handleSubmit = (value) => {
    const { session } = this.props
    if (!session.loginLinkLoading && !session.loginLinkSuccess) {
      this.props.requestLoginLink(value)
    }
  }

  render () {
    const { session } = this.props
    return (
      <div className={style.backgroundContainer}>
        <div className={style.container}>
          <Grid container className={style.mainGrid}>
            <Grid item xs={12} sm={6} className={style.section}>
              <Description />
            </Grid>
            <Grid item xs={12} sm={6} className={style.section}>
              <Paper
                className={style.paper}
                children={[
                  <div className={style.heading}>
                    <Logo
                      shortenAtWidthOf={400}
                      center
                    />
                  </div>,
                  (session.loginLinkSuccess) ? (
                    <Info />
                  ) : (
                    <Input
                      handleSubmit={this.handleSubmit}
                      error={(session.loginLinkFailed) ? 'Please try again.' : undefined}
                      disabled={session.loginLinkLoading}
                    />
                  )

                ]} />
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { session } = state
  return { session }
}

const mapDispatchToProps = {
  requestLoginLink
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
