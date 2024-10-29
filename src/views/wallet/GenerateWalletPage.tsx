/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useWalletContext, WalletProvider } from '@/contexts/WalletContext.tsx'
import Navbar from '@/components/Navbar'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast.ts'
import { useAuthContext } from '@/contexts/AuthContext'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table.tsx'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { ChainType, Wallet } from '@/types'
import { Copy, CopyCheck } from 'lucide-react'
import { truncateString } from '@/lib/utils'
import { useModalContext } from '@/contexts/ModalContext'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    PaginationLink
} from '@/components/ui/pagination'
import DepositTxModal from '@/components/DepositTxModal'
import WalletDetailModal from '@/components/WalletDetailModal'

export const chainTypeMap: Record<ChainType, string> = {
    BSC_MAINNET: 'BSC Mainnet',
    BSC_TESTNET: 'BSC Testnet',
    BITCOIN_MAINNET: 'Bitcoin Mainnet',
    BITCOIN_TESTNET: 'Bitcoin Testnet',
    ETH_MAINNET: 'ETH Mainnet',
    ETH_TESTNET: 'ETH Testnet'
}

const GenerateWalletPage: React.FC = () => {
    const { isLogin } = useAuthContext()

    if (!isLogin) {
        return (
            <div className={clsx('bg-background', 'w-full h-screen')}>
                <div className='flex justify-center'>Please login to generate a wallet</div>
            </div>
        )
    }

    return (
        <div className={clsx('bg-background', 'w-full h-screen')}>
            <Navbar title={'Generate Wallet'} />
            <WalletProvider>
                <div className='flex flex-col gap-4 p-4'>
                    <WalletButtonGroup />
                    <MyWallets />
                </div>
            </WalletProvider>
        </div>
    )
}

const WalletButtonGroup: React.FC = () => {
    const { generateWallet } = useWalletContext()
    const { toast } = useToast()
    const { openModal } = useModalContext()
    const [loading, setLoading] = React.useState<boolean>(false)

    const handleOpenGenerateModal = () => {
        openModal({
            title: 'Generate Wallet',
            content: <GenerateWalletModal onGenerate={handleGenerateWallet} />
        })
    }

    const handleGenerateWallet = async (network: string) => {
        if (!network) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Network is required to generate a wallet.'
            })
            return
        }

        setLoading(true)
        try {
            await generateWallet(network)
        } catch (error) {
            console.error('Error generating wallet:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An error occurred while generating the wallet.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='max-w-[50vh] flex justify-center items-center gap-4'>
                <Button className='flex-1' variant='emerald' disabled>
                    Import Wallet
                </Button>
                <Button
                    className='flex-1'
                    variant='brand'
                    onClick={handleOpenGenerateModal}
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Wallet'}
                </Button>
            </div>
        </div>
    )
}

const GenerateWalletModal: React.FC<{ onGenerate: (network: string) => Promise<void> }> = ({
    onGenerate
}) => {
    const [network, setNetwork] = React.useState<string>('BSC_MAINNET')
    const { closeModal } = useModalContext()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onGenerate(network)
        closeModal()
    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex gap-2 items-center'>
                <label htmlFor='network'>Network</label>
                <select
                    id='network'
                    className='mt-2 bg-gray-800 text-white border border-gray-600 rounded-md p-2 w-full'
                    value={network}
                    onChange={e => setNetwork(e.target.value)}
                    autoFocus
                >
                    {Object.entries(chainTypeMap).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </select>
            </div>
            <Button type='submit' variant='emerald'>
                Generate
            </Button>
        </form>
    )
}

const WalletItem: React.FC<{ wallet: Wallet; index: number }> = ({ wallet, index }) => {
    const [loading, setLoading] = React.useState<boolean>(false)
    const { isCopied, copyToClipboard } = useCopyToClipboard()
    const { openModal } = useModalContext()

    const handleOpenDepositTxModal = async (e: React.MouseEvent) => {
        e.stopPropagation()
        openModal({
            title: 'Deposit',
            content: (
                <DepositTxModal
                    networkName={chainTypeMap[wallet.network]}
                    network={wallet.network}
                    toAddress={wallet.walletAddress}
                    onLoading={setLoading}
                />
            )
        })
    }

    const handleCopyWalletAddress = (e: React.MouseEvent, walletAddress: string) => {
        e.stopPropagation()
        copyToClipboard(walletAddress)
    }

    return (
        <>
            <TableCell className='p-2 flex items-center justify-center gap-2'>
                {index + 1}.{' '}
                <span className='text-blue-600 cursor-pointer'>
                    {truncateString(wallet.walletAddress, 10, 3, 3)}
                </span>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={e => handleCopyWalletAddress(e, wallet.walletAddress)}
                >
                    {isCopied ? (
                        <CopyCheck size={16} className='text-blue-600' />
                    ) : (
                        <Copy size={16} className='text-blue-600' />
                    )}
                </Button>
            </TableCell>
            <TableCell className='p-2 text-center'>{wallet.walletType}</TableCell>
            <TableCell className='p-2 text-center'>{chainTypeMap[wallet.network]}</TableCell>
            <TableCell className='p-2 text-center'>
                <Button
                    className='flex-1'
                    variant='primary'
                    onClick={handleOpenDepositTxModal}
                    disabled={loading}
                >
                    Deposit
                </Button>
            </TableCell>
        </>
    )
}

const MyWallets: React.FC = () => {
    const {
        myWallets,
        currentPage,
        totalPages,
        limit,
        handleNextPage,
        handlePreviousPage,
        handlePageChange
    } = useWalletContext()
    const { openModal } = useModalContext()

    if (myWallets === undefined) {
        return <div>Loading...</div>
    }

    if (myWallets === null) {
        return <div>No wallets found</div>
    }

    const handleOpenModalWalletDetail = (wallet: Wallet) => {
        openModal({
            title: 'Wallet detail',
            content: <WalletDetailModal wallet={wallet} />
        })
    }

    return (
        <div className='flex flex-col gap-2 mt-4'>
            <h2 className='text-lg font-semibold'>Your Wallets</h2>
            <Table className='min-w-full bg-secondary/30 rounded'>
                <TableHeader className='rounded-lg'>
                    <TableRow>
                        <TableHead className='w-1/4 text-center'>Wallet Address</TableHead>
                        <TableHead className='w-1/4 text-center'>Wallet Type</TableHead>
                        <TableHead className='w-1/4 text-center'>Network</TableHead>
                        <TableHead className='w-1/4 text-center'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {myWallets.map((wallet, index) => (
                        <TableRow
                            key={wallet.walletAddress}
                            className='cursor-pointer'
                            onClick={() => handleOpenModalWalletDetail(wallet)}
                        >
                            <WalletItem wallet={wallet} index={index + (currentPage - 1) * limit} />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={handlePreviousPage}
                            isActive={currentPage > 1}
                        />
                    </PaginationItem>
                    {currentPage > 1 && (
                        <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                                {currentPage - 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationLink isActive>{currentPage}</PaginationLink>
                    </PaginationItem>
                    {currentPage < totalPages && (
                        <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
                                {currentPage + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationNext
                            onClick={handleNextPage}
                            isActive={currentPage < totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default GenerateWalletPage
