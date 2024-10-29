import { useEffect, useState } from 'react'
import { ITelegramUser, IWebApp } from '@/types'

const useTelegram = () => {
    const [user, setUser] = useState<ITelegramUser | null>(null)

    useEffect(() => {
        const tg = (window as { Telegram?: { WebApp: IWebApp } }).Telegram?.WebApp
        if (tg) {
            tg.ready()
            const initDataUnsafe = tg.initDataUnsafe
            if (initDataUnsafe && initDataUnsafe.user) {
                const { id, first_name, last_name, username, photo_url } = initDataUnsafe.user
                setUser({ id, first_name, last_name, username, photo_url })
            } else {
                console.error('User data not available.')
            }
        } else {
            console.error('Telegram WebApp not available.')
        }
    }, [])

    return { user }
}

export default useTelegram
