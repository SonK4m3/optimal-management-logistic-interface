import { useState, useEffect } from 'react'
import { Chain } from '@/types'
import RequestFactory from '@/services/RequestFactory'

const useFetchExchange = () => {
    const [networks, setNetworks] = useState<Chain[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchChains = async () => {
            try {
                const exchangeRequest = RequestFactory.getRequest('ExchangeRequest')
                const response = await exchangeRequest.getNetworks()
                setNetworks(response.networks)
                setLoading(false)
            } catch (err) {
                setError('Failed to fetch exchange networks')
                setLoading(false)
            }
        }

        fetchChains()
    }, [])

    return { networks, loading, error }
}

export default useFetchExchange
