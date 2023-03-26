// import { UserBrief } from '../../types/users.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserType } from '../../types/users.type'

type UserState = {
  users: UserType
  sort: {
    sortField: string
    sortReversed: boolean
  }
}

const initialState: UserState = {
  users: [],
  sort: {
    sortField: 'username',
    sortReversed: false
  }
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateUsers: (state: UserState, action: PayloadAction<UserType>) => {
      state.users = action.payload
    },
    sortFullName: (state: UserState) => {
      state.sort.sortReversed = !state.sort.sortReversed
      state.sort.sortField = 'fullname'
    },
    sortUserName: (state: UserState) => {
      state.sort.sortReversed = !state.sort.sortReversed
      state.sort.sortField = 'username'
    }
  }
})

export default usersSlice.reducer

export const { updateUsers, sortFullName, sortUserName } = usersSlice.actions
