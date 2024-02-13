import { configureStore } from '@reduxjs/toolkit'
import Slice from '../State/Slice'
import Activechatslice from '../State/Activechatslice'

// eslint-disable-next-line react-refresh/only-export-components
export default configureStore({
  reducer: {
    userLoginInfo:Slice,
    activechatInfo : Activechatslice
  },
})