import configs from '@/configs'
import { ChainType } from '@/types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import BigNumber from 'bignumber.js'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Converts an ISO date string to a human-readable format.
 * @param isoDate - The ISO date string (e.g., '2024-11-05T00:00:00Z').
 * @returns The formatted date string (e.g., 'Nov 5, 2024').
 */
export function formatDate(isoDate: string): string {
    const date = new Date(isoDate)

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date)
}

export function formatCurrency(value: number): string {
    if (value >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(1)}b`
    } else if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}m`
    } else if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(1)}k`
    } else {
        return `$${value.toFixed(0)}`
    }
}

export function formatToCents(value: number, digit: number = 5): string {
    const formatterCents = new Intl.NumberFormat('default', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: digit
    })

    const formattedValue = formatterCents.format(value * 100)
    return formattedValue.replace('€', '¢')
}

export function truncateString(
    str: string,
    maxLength: number,
    keepStart: number,
    keepEnd: number
): string {
    if (str.length <= maxLength) {
        return str
    }

    if (keepStart + keepEnd >= maxLength) {
        return str.substring(0, maxLength)
    }

    const start = str.substring(0, keepStart)
    const end = str.substring(str.length - keepEnd)

    return `${start}...${end}`
}

export function queryParams(params: Record<string, string | number | boolean>) {
    return Object.fromEntries(Object.entries(params).filter(param => param[1]))
}

export function standardizeString(value?: string): string {
    if (!value) return ''
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

export function timeFrameToMillis(timeFrame: string): number {
    switch (timeFrame) {
        case '1m':
            return 60 * 1000
        case '3m':
            return 3 * 60 * 1000
        case '5m':
            return 5 * 60 * 1000
        case '15m':
            return 15 * 60 * 1000
        case '30m':
            return 30 * 60 * 1000
        case '1h':
            return 60 * 60 * 1000
        case '2h':
            return 2 * 60 * 60 * 1000
        case '4h':
            return 4 * 60 * 60 * 1000
        case '1d':
            return 24 * 60 * 60 * 1000
        default:
            return 60 * 1000
    }
}

export const getEtherscanTransactionExplorerUrl = (
    txHash: string | undefined,
    network: ChainType
) => (txHash ? `${configs.app.networks[network]?.blockExplorerUrls?.[0]}/tx/${txHash}` : '#')

export const getEtherscanAddressExplorerUrl = (address: string | undefined, network: ChainType) =>
    address ? `${configs.app.networks[network]?.blockExplorerUrls?.[0]}/address/${address}` : '#'

export const convertDecToWei = (number: string | number, decimals = 18): string => {
    return new BigNumber(number || 0)
        .multipliedBy(new BigNumber(10).exponentiatedBy(decimals))
        .toString()
}

export const convertWeiToDec = (weiNumber: string | BigNumber, decimals = 18): string => {
    const number = new BigNumber(weiNumber || 0).div(new BigNumber(10).exponentiatedBy(decimals))
    return new BigNumber(number).toString()
}

export function formatNumberWithCommas(number: number | string): string {
    const num = typeof number === 'string' ? parseFloat(number) : number

    const [integerPart, decimalPart] = num.toString().split('.')

    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart
}
