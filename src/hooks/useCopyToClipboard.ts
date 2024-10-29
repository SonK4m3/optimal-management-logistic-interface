import { useState } from 'react'

const TIMEOUT_DELAY = 5000

function useCopyToClipboard() {
    const [isCopied, setIsCopied] = useState<boolean>(false)

    const copyToClipboard = async (text: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(text)
            setIsCopied(true)

            setTimeout(() => {
                setIsCopied(false)
            }, TIMEOUT_DELAY)
        } catch (error) {
            console.error('Failed to copy text:', error)
            setIsCopied(false)
        }
    }

    return { isCopied, copyToClipboard }
}

export default useCopyToClipboard
