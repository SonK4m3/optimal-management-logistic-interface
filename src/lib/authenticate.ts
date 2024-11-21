import axios from 'axios'

export const setAuthorizationToRequest = (accessToken: string | undefined): void => {
    if (!accessToken) {
        delete axios.defaults.headers.common['Authorization']
    } else {
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    }
}

export const setDefaultAuthorizationToRequest = (): void => {
    delete axios.defaults.headers.common['Authorization']
}
