import React from 'react'

import UserItem from './UserItem'
import AddUser from './AddUser'

class UserList extends React.Component {
  state = {
    loading: false,
    finished: false,
    failed: false,
    users: []
  }

  loadUsers = () => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/users`,
      {
        credentials: 'include',
        method: 'GET'
      })
      .then(response => response.json())
      .then(users => this.setState({ loading: false, finished: true, failed: false, users }))
      .catch(() => this.setState({ loading: false, failed: true }))
  }

  componentDidMount () {
    this.loadUsers()
  }

  render () {
    const { users } = this.state
    return (
      <div style={{ margin: 'auto', width: '90%', maxWidth: '500px' }}>
        <h1 style={{ textAlign: 'center' }}>Users</h1>
        <table width='100%'>
          <tbody>
            <tr>
              <td><b>Name</b></td>
              <td><b>Mail</b></td>
              <td><b>Role</b></td>
            </tr>
            {users.map(user =>
              <UserItem
                key={user.id}
                name={user.name}
                role={user.role}
                email={user.email}
                reload={this.loadUsers}
              />
            )}
            <AddUser reload={this.loadUsers} />
          </tbody>
        </table>
      </div>
    )
  }
}

export default UserList
