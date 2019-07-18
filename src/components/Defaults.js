import { MdNotInterested } from 'react-icons/md'
import { GoBeaker } from 'react-icons/go'
import { FaLaughBeam, FaBalanceScale } from 'react-icons/fa'
import { IoIosCheckmarkCircle, IoIosHammer } from 'react-icons/io'

export const MARKER_SIZE = 20

export const DOWN_SCALE_FACTOR = 0.6
export const LOST_PETAL_DOWN_SCALE_FACTOR = 1

export const MAGNIFY_SPEED = 600
export const UNMAGNIFY_SPEED = 800

export const FLAVORS = [
  {
    name: 'Neutral',
    color: '#979ca6',
    icon: FaBalanceScale
  },
  {
    name: 'Pro',
    color: '#4b8a6e',
    icon: IoIosCheckmarkCircle
  },
  {
    name: 'Contra',
    color: '#ff2b4d',
    icon: MdNotInterested
  },
  {
    name: 'Science',
    color: '#496f8e',
    icon: GoBeaker
  },
  {
    name: 'Joke',
    color: '#ffe761',
    icon: FaLaughBeam
  },
  {
    name: 'Fact Check',
    color: '#457ece',
    icon: IoIosHammer
  }
]
