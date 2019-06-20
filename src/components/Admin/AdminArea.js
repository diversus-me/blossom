import React from 'react'
import { connect } from 'react-redux'

import UserList from './UserList'

class AdminArea extends React.Component {
  componentDidUpdate () {
    const { role, authenticated, loading } = this.props.session
    if ((role !== 'admin' && authenticated && !loading) ||
        (!loading && !authenticated)) {
      this.props.history.push('/')
    }
  }

  render () {
    return [
      <UserList key='userList' />
    ]
  }
}

function mapStateToProps (state) {
  const { session } = state
  return { session }
}

export default connect(mapStateToProps)(AdminArea)
