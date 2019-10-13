import React from 'react'

import style from './Button.module.css'

export default (props) => {
  return (
    <div
      className={`${style.button} ${(props.deactivated) ? style.deactivated : ''}`}
      onClick={(props.deactivated) ? () => {} : props.onClick}
    >
      <div className={style.text}>{props.text}</div>
    </div>
  )
}
