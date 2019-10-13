import React from 'react'
import PropTypes from 'prop-types'

import classNames from './FloatingButton.module.css'

function FloatingButton (props) {
  const { style, children, onClick, className, deactivated } = props
  return (
    <div
      style={{
        ...style,
        borderRadius: (props.round) ? '50%' : '100px'
      }}
      className={`${classNames.button} ${className} ${(deactivated) ? classNames.deactivated : ''}`}
      onClick={(deactivated) ? () => {} : onClick}
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
