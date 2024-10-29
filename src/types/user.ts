export type OAuthProvider = 'google' | 'apple'

export type OAuthConfig = {
    clientId: string
    redirectUri: string
}

export type User = {
    id: string
    name: string
    email: string
    picture: string
}
