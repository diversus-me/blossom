import React from 'react'
import propTypes from 'prop-types'
import classnames from 'classnames'
import moment from 'moment'

import style from './FlowerItem.module.css'

class FlowerItem extends React.Component {
  constructor (props) {
    super(props)
    this.num = Math.floor(Math.random() * 99)
    this.gender = (Math.random() > 0.5) ? 'women' : 'men'
  }

  render () {
    const { title, videoId, description, created, user } = this.props
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
          <p className={style.text}>{description}</p>
          {/* <div className={style.bottom}> */}
          <div className={classnames(style.date)}>{moment(created).fromNow()}</div>
          <div className={style.user}>
            <div
              className={style.userImage}
              style={{ backgroundImage: `url(https://randomuser.me/api/portraits/${this.gender}/${this.num}.jpg)` }}
            />
            <div className={classnames(style.username)}>{user.name}</div>
          </div>
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
  user: propTypes.object.isRequired
}

export default FlowerItem
