import queryString from 'query-string'
import { history } from '../state/configureStore'

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
}
