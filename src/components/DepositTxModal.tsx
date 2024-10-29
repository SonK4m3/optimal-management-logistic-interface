/* eslint-disable @typescript-eslint/no-explicit-any */
import configs from '@/configs'
import { useModalContext } from '@/contexts/ModalContext'
import { ChainType } from '@/types'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { chainTypeMap } from '@/views/wallet/GenerateWalletPage'
import { findChainConfigByChainId, getDappWalletByChain } from '@/lib/dapp-wallet'
import { useAppConnectWallet } from '@/hooks/useAppConnectWallet'
import { useConnector } from '@/hooks/useConnector'
import { toast } from '@/components/ui/use-toast'
import { getEtherscanTransactionExplorerUrl, truncateString } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { LoadingSpinner } from '@/components/ui/spinner'

type TModalName =
    | 'CONNECT_WALLET'
    | 'DEPOSIT'
    | 'SWITCH_NETWORK'
    | 'WAITING_TRANSACTION'
    | 'CONFIRM_TRANSACTION'
    | 'LOADING'

type TDepositForm = {
    tokenAddress: string
    amount: string
}

const DepositTxModal: React.FC<{
    networkName: string
    network: ChainType
    toAddress: string
    onLoading: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ network, toAddress, onLoading }) => {
    const [txHash, setTxHash] = React.useState<string>()
    const { closeModal } = useModalContext()
    const { connectorHandlers } = useConnector()
    const [modalName, setModalName] = React.useState<keyof typeof modalMap>('LOADING')

    const chainId = configs.app.networks[network]?.chainId || ''
    const dappWallet = getDappWalletByChain(network)
    const isConnected = connectorHandlers[dappWallet].isConnected
    const currentChainId = connectorHandlers[dappWallet].currentChainId
    const account = connectorHandlers[dappWallet].account

    useEffect(() => {
        const checkConnectDappWallet = async () => {
            switch (true) {
                case !connectorHandlers[dappWallet].isConnected || !account:
                    setModalName('CONNECT_WALLET')
                    break
                case connectorHandlers[dappWallet].currentChainId !== chainId:
                    setModalName('SWITCH_NETWORK')
                    break
                default:
                    setModalName('DEPOSIT')
            }
        }
        checkConnectDappWallet().then()
    }, [account, isConnected, currentChainId])

    useEffect(() => {
        if (txHash) {
            setModalName('CONFIRM_TRANSACTION')
        }
    }, [txHash])

    const ConnectWalletModal = () => {
        const { connectWallet } = useAppConnectWallet()

        const handleConnectDappWallet = async (e: React.FormEvent) => {
            e.preventDefault()
            await connectWallet(dappWallet, chainId)
        }

        return (
            <form onSubmit={handleConnectDappWallet} className='flex flex-col gap-4'>
                <div className='flex gap-2 items-center'>
                    You must connect with {dappWallet} to continue
                </div>
                <div className='flex gap-2 items-center'>
                    <label htmlFor='network'>Network</label>
                    <input
                        id='network'
                        className='mt-2 bg-gray-800 text-white border border-gray-600 rounded-md p-2 w-full disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed'
                        value={chainTypeMap[network]}
                        disabled
                    />
                </div>
                <Button type='submit' variant='emerald'>
                    Connect with {dappWallet}
                </Button>
            </form>
        )
    }

    const DepositModal = () => {
        const [isLoading, setIsLoading] = React.useState(false)
        const {
            register,
            handleSubmit,
            setError,
            formState: { errors }
        } = useForm<TDepositForm>()

        const handleDeposit = async ({
            amount,
            tokenAddress,
            decimals
        }: TDepositForm & { decimals: number }) => {
            try {
                onLoading(true)
                setModalName('WAITING_TRANSACTION')

                const txHash = await connectorHandlers[dappWallet].sendToken({
                    toAddress,
                    amount,
                    tokenCurrency: {
                        address: tokenAddress,
                        decimals
                    }
                })
                setTxHash(txHash)
            } catch (error) {
                console.error('Error send deposit transaction:', error)
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'An error occurred while sending transaction.'
                })
                closeModal()
            } finally {
                onLoading(false)
            }
        }

        const onSubmit = async (data: TDepositForm) => {
            try {
                setIsLoading(true)
                const decimals = await connectorHandlers[dappWallet].getTokenDecimals(
                    data.tokenAddress
                )
                await handleDeposit({ ...data, decimals })
            } catch (error) {
                console.error('Error get token decimals:', error)
                setError('tokenAddress', {
                    type: 'manual',
                    message: 'Failed to get token decimals. Please check token address.'
                })
            } finally {
                setIsLoading(false)
            }
        }

        return (
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <div className='flex flex-row gap-2 items-center'>
                    <label htmlFor='token-address'>Token Address</label>
                    <div className='flex flex-col w-full'>
                        <input
                            id='token-address'
                            className='mt-2 bg-gray-800 text-white border border-gray-600 rounded-md p-2 w-full'
                            {...register('tokenAddress', {
                                required: 'Token address is required',
                                pattern: {
                                    value: /^0x[a-fA-F0-9]{40}$/,
                                    message: 'Token address is invalid'
                                }
                            })}
                            autoFocus
                        />
                        {errors.tokenAddress && (
                            <p className='text-red-500 text-sm'>{errors.tokenAddress.message}</p>
                        )}
                    </div>
                </div>
                <div className='flex gap-2 items-center'>
                    <label htmlFor='amount'>Amount</label>
                    <div className='flex flex-col w-full'>
                        <input
                            id='amount'
                            className='mt-2 bg-gray-800 text-white border border-gray-600 rounded-md p-2 w-full'
                            {...register('amount', {
                                validate: {
                                    required: value => value !== '' || 'Amount is required',
                                    isNumber: value =>
                                        !isNaN(Number(value)) || 'Amount must be a number',
                                    positive: value =>
                                        Number(value) > 0 || 'Amount must be greater than zero'
                                }
                            })}
                        />
                        {errors.amount && (
                            <p className='text-red-500 text-sm'>{errors.amount.message}</p>
                        )}
                    </div>
                </div>

                <Button type='submit' variant='emerald' disabled={isLoading}>
                    {isLoading ? <LoadingSpinner /> : 'Deposit'}
                </Button>
            </form>
        )
    }

    const SwitchNetworkModal = () => {
        const handleSwitchNetwork = async (e: React.FormEvent) => {
            e.preventDefault()
            const chain = findChainConfigByChainId(chainId)
            connectorHandlers[dappWallet].switchNetwork(chain)
        }

        return (
            <form onSubmit={handleSwitchNetwork} className='flex flex-col gap-4'>
                <div className='flex gap-2 items-center'>
                    You must switch chain {chainId} to continue
                </div>
                <div className='flex gap-2 items-center'>
                    <label htmlFor='network'>Network</label>
                    <input
                        id='network'
                        className='mt-2 bg-gray-800 text-white border border-gray-600 rounded-md p-2 w-full disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed'
                        value={chainTypeMap[network]}
                        disabled
                    />
                </div>
                <div className='flex gap-2 items-center'>
                    <label htmlFor='chain-id'>Chain Id</label>
                    <input
                        id='chain-id'
                        className='mt-2 bg-gray-800 text-white border border-gray-600 rounded-md p-2 w-full disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed'
                        value={chainId}
                        disabled
                    />
                </div>
                <Button type='submit' variant='emerald'>
                    Switch network
                </Button>
            </form>
        )
    }

    const WaitingTransactionModal = (
        <div className='flex flex-col gap-4'>
            <div className='gap-2 items-center justify-center'>Waiting for transaction...</div>
        </div>
    )

    const ConfirmTransactionModal = (
        <div className='flex flex-col gap-4'>
            <div className='gap-2 items-center justify-center'>
                <div>Transaction has been sent successfully</div>
            </div>
            <div className='flex gap-2 items-center'>
                <span>Transaction hash: </span>
                <span>
                    <a
                        href={getEtherscanTransactionExplorerUrl(txHash, network)}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-500 underline'
                    >
                        {truncateString(txHash || '', 30, 10, 15)}
                    </a>
                </span>
            </div>
            <Button type='button' variant='emerald' onClick={closeModal}>
                Close
            </Button>
        </div>
    )

    const LoadingModal = (
        <div className='flex flex-col gap-4'>
            <div className='gap-2 items-center justify-center'>Loading...</div>
        </div>
    )

    const modalMap: { [key in TModalName]: JSX.Element } = {
        CONNECT_WALLET: <ConnectWalletModal />,
        DEPOSIT: <DepositModal />,
        SWITCH_NETWORK: <SwitchNetworkModal />,
        WAITING_TRANSACTION: WaitingTransactionModal,
        CONFIRM_TRANSACTION: ConfirmTransactionModal,
        LOADING: LoadingModal
    }

    return modalMap[modalName]
}

export default DepositTxModal
