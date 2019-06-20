import React, { useState } from 'react'

const style = {
  minWidth: '100%',
  paddingTop: '100%',
  background: '#DDD',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '50% 50%'
}

function RandomUserImage (props) {
  const [number] = useState(Math.floor(Math.random() * 99))
  const [gender] = useState((Math.random() > 0.5) ? 'women' : 'men')
  return (
    <div
      className={style.userImage}
      style={{
        ...style,
        borderRadius: (props.round) ? '99999px' : '',
        backgroundImage: `url(https://randomuser.me/api/portraits/${gender}/${number}.jpg)`
      }}
    />
  )
}

export default RandomUserImage
