import React from 'react'

export default function SVG (props) {
  return (
    <object
      type='image/svg+xml'
      className={props.className}
      width='50px'
      height='200px'
      data={props.src} />
  )
}
