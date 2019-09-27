import queryString from 'query-string'
import { history } from '../configureStore'

export const SELECT_PETAL = 'SELECT_PETAL'

export function selectPetal (petal) {
  const parsed = queryString.parse(history.location.search)

  const id = (petal) ? petal.id : undefined

  if (parseInt(parsed.s) !== id) {
    if (id) {
      history.push({ search: `s=${id}` })
    } else {
      history.push({ search: '' })
    }
  }
  return {
    type: 'test'
    // type: SELECT_PETAL,
    // id,
    // petal
  }
}
