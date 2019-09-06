import React from 'react'
import propTypes from 'prop-types'
import classnames from 'classnames'
import moment from 'moment'
import { connect } from 'react-redux'
import { MdEdit, MdClear, MdDateRange } from 'react-icons/md'
import { toast } from 'react-toastify'

import { listFlowers } from '../../state/flowerList/actions'

import RandomUserImage from '../Dummies/RandomUserImage'
import Overlay from '../UI/Overlay'
import EditFlowerFrom from '../Forms/EditFlowerForm'

import style from './FlowerItem.module.css'

class FlowerItem extends React.Component {
  state = {
    editFlowerVisibility: false
  }

  toggleEdit = (e) => {
    e.preventDefault()
    this.setState({
      editFlowerVisibility: !this.state.editFlowerVisibility
    })
  }

  delete = (e) => {
    const { title, id } = this.props
    e.preventDefault()
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/flower`,
        {
          credentials: 'include',
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })
        .then(response => {
          if (response.ok) {
            return response
          } else {
            throw new Error('failed')
          }
        })
        .then(() => toast.success('Flower successfully deleted'))
        // TODO: Why does reloading the flower instantly after deleting cause wrong responses?
        .then(setTimeout(this.props.listFlowers, 300))
        .catch(() => {
          toast.error('Flower could not be deleted.')
        })
    }
  }

  render () {
    const { title, id, videoId, description, created, user, session } = this.props
    const { editFlowerVisibility } = this.state
    return (
      <div className={style.container}>
        <div className={style.right}>
          <div
            style={{ backgroundImage: `url(https://img.youtube.com/vi/${videoId}/sddefault.jpg)` }}
            className={style.image}
          />
        </div>
        <div className={classnames(style.block, style.left)}>
          <div className={style.title}>{title}</div>
          <div className={style.dateContainer}>
            <MdDateRange size={'20px'} color='grey' />
            <span className={style.date}>{moment(created).fromNow()}</span>
          </div>
          <div className={style.user}>
            <RandomUserImage round />
            <div className={classnames(style.username)}>{user.name}</div>
          </div>
          {session.authenticated && (session.role === 'admin' || session.id === user.id) &&
          [
            <div
              key='edit'
              className={classnames(style.edit)}
              onClick={this.toggleEdit}
            >
              <MdEdit color='grey' />
            </div>,
            <div
              key='delete'
              className={classnames(style.delete)}
              onClick={this.delete}
            >
              <MdClear color='grey' size='1.1em' />
            </div>,
            <Overlay key='editOverlay' visibility={editFlowerVisibility} onOuterClick={this.toggleEdit}>
              <EditFlowerFrom
                title={title}
                description={description}
                id={id}
              />
            </Overlay>
          ]
          }
        </div>
      </div>
    )
  }
}

FlowerItem.defaultProps = {
  description: 'No description.'
}

FlowerItem.propTypes = {
  title: propTypes.string.isRequired,
  videoId: propTypes.string.isRequired,
  description: propTypes.string,
  created: propTypes.instanceOf(Date).isRequired,
  user: propTypes.object.isRequired,
  id: propTypes.number.isRequired
}

function mapStateToProps (state) {
  const { session } = state
  return { session }
}

const mapDispatchToProps = {
  listFlowers
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowerItem)
