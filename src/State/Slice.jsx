import { createSlice } from '@reduxjs/toolkit'

export const Slice = createSlice({
  name: 'user',
  initialState: {
    userInfo:localStorage.getItem('userLoginInfo') ? JSON.parse(localStorage.getItem('userLoginInfo') ) : null,
  },
  reducers: {
    userLoginInfo:(state , actions)=>{
      state.userInfo = actions.payload
    }
  },
})

export const {userLoginInfo} = Slice.actions

export default Slice.reducer