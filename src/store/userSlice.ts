import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IUser {
    id: string
    name: string
    email: string
    picture: string
}

interface UserState {
    accessToken: string | null
    user: IUser | null
    isLoading: boolean
    error: string | null
}

const initialState: UserState = {
    accessToken: null,
    user: null,
    isLoading: false,
    error: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: state => {
            state.isLoading = true
            state.error = null
        },
        loginSuccess: (state, action: PayloadAction<{ accessToken?: string; user?: IUser }>) => {
            state.isLoading = false
            if (action.payload.accessToken) {
                state.accessToken = action.payload.accessToken
            }
            if (action.payload.user) {
                state.user = action.payload.user
            }
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },
        logout: state => {
            state.accessToken = null
            state.user = null
            state.isLoading = false
            state.error = null
        }
    }
})

export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions

export default userSlice.reducer
