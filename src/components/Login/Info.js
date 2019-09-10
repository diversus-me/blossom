import React from 'react'
import style from './Login.module.css'

import { MdDone } from 'react-icons/md'

export default function Info ({ icon, text1, text2 }) {
  return (
    <div className={style.info}>
      <MdDone
        size='50'
        color='green'
        className={style.img}
      />
      <p className={style.infoText}>Magic link sent.</p>
      <div className={style.thankyou}>Please check you inbox.</div>
    </div>
  )
}
