import React from 'react'

export default function SVG (props) {
  return (
    <object
      type='image/svg+xml'
      className={props.className}
      data={props.src} />
  )
}
