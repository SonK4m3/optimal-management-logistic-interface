import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { setAuthorizationToRequest, setDefaultAuthorizationToRequest } from '@/lib/authenticate.ts'
import { store } from '@/store'
import { logout } from '@/store/userSlice'
import { loginFailure } from '@/store/userSlice'
import { loginStart } from '@/store/userSlice'
import { loginSuccess } from '@/store/userSlice'
import { User } from '@/types/user'
import AuthRequest from '@/services/AuthRequest'

interface AuthContextProps {
    handleLogin: (
        data: { username: string; password: string },
        onSuccess?: () => void
    ) => Promise<void>
    handleLogout: (onSuccess?: () => void) => Promise<void>
    handleRegister: (
        data: { username: string; password: string; email: string },
        onSuccess?: () => void,
        onError?: (error: string) => void
    ) => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const authRequest = new AuthRequest()
    const dispatch = useDispatch()

    const handleLogin = async (
        data: { username: string; password: string },
        onSuccess?: () => void
    ) => {
        try {
            dispatch(loginStart())
            const response = await authRequest.login(data.username, data.password)
            if (response.success) {
                const user: User = {
                    id: response.data.id,
                    username: response.data.username,
                    email: response.data.email,
                    role: response.data.role
                }
                dispatch(
                    loginSuccess({
                        accessToken: response.data.token,
                        user: user
                    })
                )
                onSuccess?.()
            } else {
                dispatch(loginFailure(response.message))
            }
        } catch (error) {
            dispatch(loginFailure('Login failed'))
        }
    }

    const handleRegister = async (
        data: { username: string; password: string; email: string },
        onSuccess?: () => void,
        onError?: (error: string) => void
    ) => {
        try {
            const response = await authRequest.register({
                username: data.username,
                email: data.email,
                password: data.password,
                fullName: data.username,
                role: 'CUSTOMER'
            })
            if (response.success) {
                onSuccess?.()
            } else {
                onError?.(response.message)
            }
        } catch (error) {
            onError?.(error as string)
        }
    }

    const handleLogout = useCallback(
        async (onSuccess?: () => void) => {
            setDefaultAuthorizationToRequest()
            dispatch(logout())
            onSuccess?.()
        },
        [dispatch]
    )

    const checkTokenExpiration = useCallback((token: string): boolean => {
        try {
            const decodedToken = jwtDecode<{ exp: number }>(token)
            return Date.now() >= decodedToken.exp * 1000
        } catch (error) {
            console.error('Error decoding token:', error)
            return true
        }
    }, [])

    const setupExpirationTimer = useCallback(
        (token: string) => {
            const decodedToken = jwtDecode<{ exp: number }>(token)
            const expirationTime = decodedToken.exp * 1000
            const timeUntilExpiration = expirationTime - Date.now()

            if (timeUntilExpiration <= 0) {
                handleLogout()
            } else {
                setTimeout(() => {
                    handleLogout()
                }, timeUntilExpiration)
            }
        },
        [handleLogout]
    )

    useEffect(() => {
        const checkAndSetupToken = () => {
            const state = store.getState()
            const token = state.user.accessToken
            if (token) {
                if (checkTokenExpiration(token)) {
                    handleLogout()
                } else {
                    setAuthorizationToRequest(token)
                    setupExpirationTimer(token)
                }
            }
        }

        checkAndSetupToken()
        const unsubscribe = store.subscribe(checkAndSetupToken)
        return () => unsubscribe()
    }, [checkTokenExpiration, handleLogout, setupExpirationTimer])

    return (
        <AuthContext.Provider value={{ handleLogin, handleLogout, handleRegister }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = (): AuthContextProps => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}
