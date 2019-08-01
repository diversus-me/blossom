import React from 'react'
import PropTypes from 'prop-types'

import classNames from './FloatingButton.module.css'

function FloatingButton (props) {
  const { style, children, onClick } = props
  return (
    <div
      style={style}
      className={classNames.button}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

FloatingButton.defaultProps = {
  styling: {}
}

FloatingButton.propTypes = {
  onClickCallback: PropTypes.func.isRequired,
  styling: PropTypes.object
}

export default FloatingButton
