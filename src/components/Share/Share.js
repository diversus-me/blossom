import React, { useState } from 'react'

import ShareButton from './ShareButton'
import SharePanel from './SharePanel'

function Share () {
  const [show, setShow] = useState(0)
  return [
    <SharePanel
      key='sharePanel'
      title={'Share Flower.'}
      styling={show ? {} : { display: 'none' }}
    />,
    <ShareButton
      key='shareButton'
      onClickCallback={() => setShow(!show)}
    />
  ]
}

export default Share
