import React from 'react'

import { MdSearch } from 'react-icons/md'

import style from './VideoLinker.module.css'

function VideoLinker (props) {
  return (
    <div className={style.container}>
      <input
        className={style.input}
        placeholder='Search'
      />
      <MdSearch
        className={style.icon}
        size={25}
      />
    </div>
  )
}

export default VideoLinker
