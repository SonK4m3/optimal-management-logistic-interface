import { User } from '@/types/user'

const PREFERENCES = 'base-ui'

interface Preferences {
    accessToken?: string
    user?: User
}

const defaultPreferences: Preferences = {}

type PreferenceKey = keyof Preferences

class Storage {
    static getStorage(): Preferences {
        const preferencesString = localStorage.getItem(PREFERENCES)
        const preferences = JSON.parse(preferencesString || '{}')
        return {
            ...defaultPreferences,
            ...preferences
        }
    }

    static setStorage(type: string, value: Preferences): void {
        localStorage.setItem(type, JSON.stringify(value))
    }

    static init(): void {
        const preferences = this.getStorage()
        this.setStorage(PREFERENCES, preferences)
    }

    static getPreference<K extends PreferenceKey>(key: K): Preferences[K] {
        const preferences = this.getStorage()
        return preferences[key]
    }

    static setPreference<K extends PreferenceKey>(key: K, value: Preferences[K]): void {
        const preferences = this.getStorage()
        preferences[key] = value
        this.setStorage(PREFERENCES, preferences)
    }

    static clear(): void {
        localStorage.removeItem(PREFERENCES)
    }
}

export default Storage
