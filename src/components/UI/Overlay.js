import React from 'react'
import PropTypes from 'prop-types'

import style from './Overlay.module.css'

function Overlay (props) {
  const { visibility, onOuterClick, children } = props
  const containerStyle = {
    display: (visibility) ? 'initial' : 'none', pointerEvents: (visibility) ? 'all' : 'none'
  }
  return [
    <div
      key={'outerContainer'}
      className={style.outerContainer}
      style={containerStyle}
      onClick={onOuterClick}
    />,
    <div
      key={'innerContainer'}
      className={style.container}
      style={containerStyle}
    >
      {children}
    </div>
  ]
}

Overlay.defaultProps = {
  visibility: false
}

Overlay.propTypes = {
  onOuterClick: PropTypes.func.isRequired,
  visibility: PropTypes.bool
}

export default Overlay
