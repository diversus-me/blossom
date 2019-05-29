export const CHANGE_POSITIONING = 'CHANGE_POSITIONING'

export const POSITIONING = [
  'NAIVE',
  'FIXED',
  'TREE',
  'TREE COMPLEX'
]

export function changePositioning (positioning) {
  return {
    type: CHANGE_POSITIONING,
    positioning
  }
}
