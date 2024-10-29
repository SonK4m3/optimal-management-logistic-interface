import axios from 'axios'

export const setAuthorizationToRequest = (accessToken: string | undefined): void => {
    if (!accessToken) {
        delete axios.defaults.headers.common['Authorization']
    } else {
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    }
    axios.defaults.headers.common['x-app-version'] = 1
}

export const setDefaultAuthorizationToRequest = (): void => {
    delete axios.defaults.headers.common['Authorization']
    axios.defaults.headers.common['x-app-version'] = 1
}
