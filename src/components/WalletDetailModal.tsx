import { Button } from '@/components/ui/button'
import { useModalContext } from '@/contexts/ModalContext'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { Wallet } from '@/types'
import { Copy, CopyCheck } from 'lucide-react'

import React, { useState } from 'react'

const WalletDetailModal: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
    const { closeModal } = useModalContext()
    const { isCopied: isCopiedWalletAddress, copyToClipboard: copyWalletAddress } =
        useCopyToClipboard()
    const { isCopied: isCopiedPrivateKey, copyToClipboard: copyPrivateKey } = useCopyToClipboard()
    const [showPrivateKey, setShowPrivateKey] = useState(false)

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-2 items-center'>
                <label htmlFor='wallet-address' className='w-[100px] shrink-0'>
                    Wallet Address
                </label>
                <span
                    id='wallet-address'
                    className='min-w-[200px] flex-grow bg-gray-800 border border-gray-600 rounded-md p-2 flex items-center justify-between'
                >
                    <span className='text-white break-all overflow-hidden'>
                        {wallet.walletAddress}
                    </span>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => copyWalletAddress(wallet.walletAddress)}
                    >
                        {isCopiedWalletAddress ? (
                            <CopyCheck size={16} className='text-blue-600' />
                        ) : (
                            <Copy
                                id='wallet-address-copy-icon'
                                size={16}
                                className='text-blue-600'
                            />
                        )}
                    </Button>
                </span>
            </div>
            <div className='flex gap-2 items-center'>
                <label htmlFor='wallet-type' className='w-[100px] shrink-0'>
                    Wallet Type
                </label>
                <span id='wallet-type' className='text-white'>
                    {wallet.walletType}
                </span>
            </div>
            <div className='flex gap-2 items-center'>
                <label htmlFor='private-key' className='w-[100px] shrink-0'>
                    Private Key
                </label>
                <span
                    id='private-key'
                    className='min-w-[200px] flex-grow bg-gray-800 border border-gray-600 rounded-md p-2 flex items-center justify-between'
                >
                    <span
                        className={`text-white break-all overflow-hidden ${showPrivateKey ? '' : 'blur-sm cursor-pointer'}`}
                        onClick={() => setShowPrivateKey(true)}
                    >
                        {wallet.privateKey}
                    </span>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => copyPrivateKey(wallet.privateKey)}
                    >
                        {isCopiedPrivateKey ? (
                            <CopyCheck size={16} className='text-blue-600' />
                        ) : (
                            <Copy id='private-key-copy-icon' size={16} className='text-blue-600' />
                        )}
                    </Button>
                </span>
            </div>
            <Button type='button' variant='emerald' onClick={closeModal}>
                Close
            </Button>
        </div>
    )
}

export default WalletDetailModal
