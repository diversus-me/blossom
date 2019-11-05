import Stop from './assets/stop.png'
import Balance from './assets/balance.png'
import Check from './assets/check.png'
import Clown from './assets/clown.png'
import Fact2 from './assets/Fact2.png'
import Science from './assets/science.png'

export const MARKER_SIZE = 20

export const DOWN_SCALE_FACTOR = 0.6
export const LOST_PETAL_DOWN_SCALE_FACTOR = 1

export const MAGNIFY_SPEED = 600
export const UNMAGNIFY_SPEED = 800

export const NAVBAR_HEIGHT = 60
export const SIDEBAR_WIDTH = 320

export const FLAVORS = [
  {
    name: 'Contradiction',
    type: 'contra',
    color: '#E74949',
    icon: Stop
  },
  {
    name: 'Support',
    type: 'pro',
    color: '#36B37E',
    icon: Check
  },
  {
    name: 'Neutral',
    type: 'neutral',
    color: '#7A869A',
    icon: Balance
  },

  {
    name: 'Science',
    type: 'science',
    color: '#6554C0',
    icon: Science
  },
  {
    name: 'Joke',
    type: 'joke',
    color: '#ffAB00',
    icon: Clown
  },
  {
    name: 'Fact Checker',
    type: 'fact check',
    color: '#2684FF',
    icon: Fact2,
    size: 41
  }
]

export function getFlavor (type) {
  return FLAVORS.find(element => {
    return element.type === type
  })
}
