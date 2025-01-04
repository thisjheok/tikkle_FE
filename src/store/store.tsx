import { configureStore } from '@reduxjs/toolkit'
import authslice from './slices/authslice'
import schoolSlice from './slices/schoolSlice'
const store = configureStore({
  reducer: {
    auth: authslice,
    school: schoolSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
