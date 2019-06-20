import React from 'react'
import classNames from 'classnames'
import { MdClear, MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'

import style from './Admin.module.css'

class UserItem extends React.Component {
delete = () => {
  const { email, name } = this.props
  if (window.confirm(`Are you sure you want to delete ${name}?`)) {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/user`,
      {
        credentials: 'include',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      .then(response => {
        if (response.ok) {
          return response
        } else {
          throw new Error('failed')
        }
      })
      .then(() => this.setState({ name: '', email: '' }))
      .then(() => toast.success('User successfully deleted'))
      .then(this.props.reload)
      .catch(() => {
        toast.error('User could not be deleted.')
      })
  }
}

render () {
  const { name, email, role } = this.props
  return (
    <tr>
      <td>{name}</td>
      <td>{email}</td>
      <td>{role}</td>
      <td>
        <div
          className={classNames(style.button, style.delete)}
          onClick={this.delete}
        >
          <MdClear color='white' />
        </div>
      </td>
      <td>
        <div
          className={classNames(style.button, style.edit)}
        >
          <MdEdit color='white' />
        </div>
      </td>
    </tr>
  )
}
}

export default UserItem
