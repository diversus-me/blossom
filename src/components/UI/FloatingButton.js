import React from 'react'
import PropTypes from 'prop-types'
import { MdAdd } from 'react-icons/md'

import style from './FloatingButton.module.css'

function FloatingButton (props) {
  const { onClickCallback, styling } = props
  return (
    <div style={styling} className={style.button} onClick={onClickCallback}>
      <MdAdd size={'25px'} color='white' />
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
