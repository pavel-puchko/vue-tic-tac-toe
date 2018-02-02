
import * as types from './mutation-types'

export const addToCart = ({ commit }, product) => {
  if (product.inventory > 0) {
    commit(types.SET_USER_IDENTITY, {
      id: product.id
    })
  }
}