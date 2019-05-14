import React from 'react'
import propTypes from 'prop-types'
import classnames from 'classnames'

import style from './FlowerItem.module.css'

class FlowerItem extends React.Component {
  render () {
    const { title, videoId } = this.props
    return (
      <div className={style.container}>
        <div className={classnames(style.block, style.right)}>
          <div
            style={{ backgroundImage: `url(https://img.youtube.com/vi/${videoId}/sddefault.jpg)` }}
            className={style.image}
          />
          <div className={style.title}>{title}</div>
        </div>
        <div className={classnames(style.block, style.left)}>
          <div className={style.text} />
          <div className={style.text} />
          <div className={style.text} />
        </div>
      </div>
    )
  }
}

FlowerItem.propTypes = {
  title: propTypes.string.isRequired,
  videoId: propTypes.string.isRequired
}

export default FlowerItem
