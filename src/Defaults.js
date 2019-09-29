import { MdNotInterested } from 'react-icons/md'
import { GoBeaker } from 'react-icons/go'
import { FaLaughBeam, FaBalanceScale } from 'react-icons/fa'
import { IoIosCheckmarkCircle, IoIosHammer } from 'react-icons/io'

export const MARKER_SIZE = 20

export const DOWN_SCALE_FACTOR = 0.6
export const LOST_PETAL_DOWN_SCALE_FACTOR = 1

export const MAGNIFY_SPEED = 600
export const UNMAGNIFY_SPEED = 800

export const NAVBAR_HEIGHT = 60
export const SIDEBAR_WIDTH = 320

export const FLAVORS = [
  {
    name: 'Neutral',
    type: 'neutral',
    color: '#979ca6',
    icon: FaBalanceScale
  },
  {
    name: 'Pro',
    type: 'pro',
    color: '#4b8a6e',
    icon: IoIosCheckmarkCircle
  },
  {
    name: 'Contra',
    type: 'contra',
    color: '#ff2b4d',
    icon: MdNotInterested
  },
  {
    name: 'Science',
    type: 'science',
    color: '#496f8e',
    icon: GoBeaker
  },
  {
    name: 'Joke',
    type: 'joke',
    color: '#ffe761',
    icon: FaLaughBeam
  },
  {
    name: 'Fact Check',
    type: 'fact check',
    color: '#457ece',
    icon: IoIosHammer
  }
]

export function getFlavor (type) {
  return FLAVORS.find((element) => {
    return element.type === type
  })
}
