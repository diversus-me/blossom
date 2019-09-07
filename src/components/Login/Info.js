import React from 'react'
import style from './Login.module.css'

export default function Info ({ icon, text1, text2 }) {
  return (
    <div className={style.info}>
      <div className={style.heading}>diversus</div>
      <img src={icon} className={style.img} />
      <p className={style.infoText}>{text1} <br /> {text2}</p>
      <div className={style.thankyou}>Thank You!</div>
    </div>
  )
}
