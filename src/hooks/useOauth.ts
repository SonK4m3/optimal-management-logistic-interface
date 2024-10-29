import { googleLogout, TokenResponse, useGoogleLogin } from '@react-oauth/google'
import { useAuthContext } from '@/contexts/AuthContext'
import { useDispatch } from 'react-redux'
import { loginSuccess, logout } from '@/store/userSlice'
import { OAuthProvider, OAuthConfig, User } from '@/types'
import { OAuthResponse } from '@/types/response'
import { useNavigate } from 'react-router-dom'

const useOauth = () => {
    const { handleLoginWithOauth, handleLogout } = useAuthContext()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleOAuthSuccess = async (
        response: OAuthResponse,
        getUserInfo: (token: string) => Promise<User>
    ) => {
        const userData = await getUserInfo(response.access_token)
        try {
            await handleLoginWithOauth(response.access_token)
            dispatch(
                loginSuccess({
                    user: userData
                })
            )
            navigate('/')
        } catch (err) {
            dispatch(logout())
            handleLogout()
        }
    }

    const handleOAuthError = (
        error: Pick<TokenResponse, 'error' | 'error_description' | 'error_uri'>
    ) => {
        console.error('OAuth error:', error)
        dispatch(logout())
        handleLogout()
    }

    const getGoogleUserInfo = async (token: string): Promise<User> => {
        const response = await fetch(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
        )
        return await response.json()
    }

    const googleLogin = useGoogleLogin({
        onSuccess: (tokenResponse: TokenResponse) =>
            handleOAuthSuccess(tokenResponse, getGoogleUserInfo),
        onError: handleOAuthError
    })

    const facebookLogin = () => {
        // TODO:Implement Facebook login logic here
        console.log('Facebook login not implemented yet')
    }

    const oauthConfigs: Record<OAuthProvider, OAuthConfig> = {
        GOOGLE: {
            name: 'Google',
            connectMethod: googleLogin,
            disconnectMethod: () => {
                googleLogout()
                handleLogout()
                dispatch(logout())
            }
        },
        FACEBOOK: {
            name: 'Facebook',
            connectMethod: facebookLogin,
            disconnectMethod: () => {
                // TODO:Implement Facebook logout logic
                handleLogout()
                dispatch(logout())
            }
        }
    }

    const authenticate = (provider: OAuthProvider) => oauthConfigs[provider]

    return { authenticate }
}

export default useOauth
