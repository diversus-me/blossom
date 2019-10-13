import React from 'react'
import style from './PetalInfo.module.css'
import Accordion from './Accordion'

const PetalInfo = (props) => {
  return (
    <div className={props.className}>
      <Accordion
        title={props.title}
        flavor={props.flavor}
        description={props.description}
        user={props.user}
        created={props.created}
        petals={props.petals}
        className={style.accordion}
        petal
      />
    </div>
  )
}

export default PetalInfo
