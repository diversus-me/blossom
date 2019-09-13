import React from 'react'
import style from './Login.module.css'

export default function Description () {
  return (
    <div className={style.description}>
      <h2 className={style.descriptionHeading}>Reclaim Your Mind!</h2>
      <p className={style.descriptionText}>
      We deserve to know exactly what's going on. Anyone can contribute to
      making our information more complete. Everyone can benefit - individually
      and as a society. The truth has many faces, but only one core.
        <p>Welcome to <b>DIVERSUS</b>.</p>
      </p>
    </div>
  )
}
