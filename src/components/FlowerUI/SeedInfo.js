import React from 'react'
import style from './SeedInfo.module.css'
import Accordion from './Accordion'

const SeedInfo = (props) => {
  return (
    <div className={props.className}>
      <Accordion
        title={props.title}
        description={props.description}
        user={props.user}
        created={props.created}
        petals={props.petals}
        className={style.accordion}
      />
    </div>
  )
}

export default SeedInfo
