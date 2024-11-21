export type OAuthProvider = 'google' | 'apple'

export type OAuthConfig = {
    clientId: string
    redirectUri: string
}

export type User = {
    id: number
    username: string
    email: string
    role: string
}
