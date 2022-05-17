import { configureStore } from '@reduxjs/toolkit'
import goods from './reducers/goods'

export const store = configureStore({
  reducer: {
    goods: goods
  }
})

window.store = store;

export default store