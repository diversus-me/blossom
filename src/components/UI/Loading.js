import React from 'react'

import style from './Login.module.css'

class Loading extends React.Component {
  render () {
    return (
      <div className={style.circle} />
    )
  }
}

export default Loading
