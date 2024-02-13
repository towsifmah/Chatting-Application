import { createSlice } from '@reduxjs/toolkit'

export const Activechatslice = createSlice({
  name: 'active',
  initialState: {
    active:localStorage.getItem('activeChat') ? JSON.parse(localStorage.getItem('activeChat')) : ""
  }, 
  reducers: {
    activeChat:(state , actions)=>{
      state.active = actions.payload
    }
  },
})

// eslint-disable-next-line react-refresh/only-export-components
export const {activeChat} = Activechatslice.actions

export default Activechatslice.reducer