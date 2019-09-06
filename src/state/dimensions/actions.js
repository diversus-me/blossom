import { getDimensions } from './helpers'

export const RESIZE = 'RESIZE'

export function resize () {
  return {
    type: RESIZE,
    dimensions: getDimensions()
  }
}
