import React from 'react'
import PropTypes from 'prop-types'
import { MdShare } from 'react-icons/md'

import style from './ShareButton.module.css'

class ShareButton extends React.Component {
  render () {
    const { onClickCallback, styling } = this.props
    return (
      <div style={styling} className={style.button} onClick={onClickCallback}>
        <MdShare size={'25px'} color='grey' />
      </div>
    )
  }
}

ShareButton.defaultProps = {
  styling: {}
}

ShareButton.propTypes = {
  onClickCallback: PropTypes.func.isRequired,
  styling: PropTypes.object
}

export default ShareButton
