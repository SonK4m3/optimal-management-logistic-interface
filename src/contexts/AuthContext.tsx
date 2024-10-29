import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { loginFailure, loginStart, loginSuccess, logout } from '@/store/userSlice'
import { jwtDecode } from 'jwt-decode'
import { setAuthorizationToRequest, setDefaultAuthorizationToRequest } from '@/lib/authenticate.ts'
import RequestFactory from '@/services/RequestFactory.ts'
import { store } from '@/store'

interface AuthContextProps {
    isLogin: boolean
    handleLogin: () => Promise<void>
    handleLogout: () => Promise<void>
    handleLoginWithOauth: (access_token: string) => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLogin, setIsLogin] = useState<boolean>(false)
    const request = RequestFactory.getRequest('AuthRequest')
    const dispatch = useDispatch()

    const handleLogin = async () => {
        // TODO:Implement other login logic
    }
    const handleLoginWithOauth = async (googleAccessToken: string) => {
        dispatch(loginStart())
        const response = await request.googleOauth(googleAccessToken)
        if (response && 'accessToken' in response) {
            dispatch(loginSuccess({ accessToken: response.accessToken }))
            setAuthorizationToRequest(response.accessToken)
            setIsLogin(true)
        } else {
            dispatch(loginFailure('Failed to login with OAuth'))
        }
    }

    const handleLogout = useCallback(async () => {
        setDefaultAuthorizationToRequest()
        dispatch(logout())
        setIsLogin(false)
    }, [dispatch])

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
                    setIsLogin(true)
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
        <AuthContext.Provider value={{ isLogin, handleLogin, handleLogout, handleLoginWithOauth }}>
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
