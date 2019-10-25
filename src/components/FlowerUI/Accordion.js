import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { MdKeyboardArrowDown } from 'react-icons/md'
import classnames from 'classnames'
import { FLAVORS } from '../../Defaults'

import style from './Accordion.module.css'

function Accordion ({
  title,
  description,
  className,
  flavor,
  dimensions,
  petals,
  user,
  created,
  petal
}) {
  const [isOpen, setOpen] = React.useState(false)
  const selectedFlavor = FLAVORS.find(flavorItem => flavorItem.type === flavor)
  return [
    <div
      key='outerClick'
      className={style.outerClickContainer}
      onClick={() => {
        setOpen(false)
      }}
      style={{
        opacity: isOpen ? 0.85 : 0,
        pointerEvents: isOpen ? 'all' : 'none',
        width: dimensions.width,
        height: dimensions.height
      }}
    />,
    <div
      key='content'
      className={className}
      style={{
        position: 'relative',
        zIndex: 4,
        transform: `translate(${isOpen && petal ? '50px, -150px' : '0, 0'})`,
        transition: 'transform 150ms ease-out'
      }}
    >
      {petal && (
        <div
          className={style.flavor}
          style={{
            color: selectedFlavor.color
          }}
          onClick={() => setOpen(!isOpen)}
        >
          {selectedFlavor.name}
          <selectedFlavor.icon
            size={20}
            style={{
              marginLeft: '8px'
            }}
          />
        </div>
      )}
      <div
        className={style.accordionTitle}
        onClick={() => setOpen(!isOpen)}
        style={{
          fontSize: petal ? '1em' : '1.2em'
        }}
      >
        {title}
        <MdKeyboardArrowDown
          style={{
            transform: `rotate(${
              (isOpen && !petal) || (petal && !isOpen) ? -180 : 0
            }deg)`
          }}
          className={style.accordionArrow}
          size={25}
          color={'black'}
        />
      </div>
      <div
        className={classnames(
          style.accordionItem,
          !isOpen ? style.collapsed : ''
        )}
        style={{
          pointerEvents: isOpen ? 'all' : 'none'
        }}
      >
        <div className={style.viewsPetals}>
          <span className={style.views}>
            <img
              className={style.viewsIcon}
              src={process.env.PUBLIC_URL + '/icons/views.svg'}
            />{' '}
            0
          </span>
          <span className={style.petals}>
            <img
              className={style.petalIcon}
              src={process.env.PUBLIC_URL + '/icons/petal.svg'}
            />{' '}
            {petals}
          </span>
          <hr className={style.line} />
        </div>
        <div className={style.accordionContent}>
          {description || 'No description provided.'}
        </div>
        <div>
          <div className={style.bottomContainer}>
            <div className={style.bottomContainerText}>{user}</div>
            <div className={classnames(style.bottomContainerText, style.date)}>
              {moment(created).fromNow()}
            </div>
          </div>
        </div>
      </div>
    </div>
  ]
}

function mapStateToProps (state) {
  const { dimensions } = state
  return { dimensions }
}

export default connect(mapStateToProps)(Accordion)
