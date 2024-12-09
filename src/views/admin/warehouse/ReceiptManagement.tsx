import { useEffect, useState } from 'react'
import { Receipt } from '@/types/warehouse'
import { Button } from '@/components/ui/button'
import AppTable, { ColumnDef } from '@/components/AppTable'
import { AppPagination } from '@/components/AppPagination'
import { useWarehouseContext } from '@/contexts/WarehouseContext'
import { cn } from '@/lib/utils'
import { RECEIPT_STATUS } from '@/constant/enum'
import { useModalContext } from '@/contexts/ModalContext'
import ReceipDetailModal from './ReceipDetailModal'
const PAGE_SIZE = 10

const ReceiptManagement = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const { receipts, receiptTotalDocs, acceptReceipt, rejectReceipt, fetchReceipts } =
        useWarehouseContext()

    const { openModal } = useModalContext()

    const receiptHeaders: ColumnDef<Receipt>[] = [
        {
            header: 'Receipt Number',
            accessorKey: 'receiptNumber'
        },
        {
            header: 'Type',
            accessorKey: 'type',
            action: item => {
                return (
                    <div
                        className={cn(
                            'text-xs uppercase rounded-full px-2 py-1 text-center',
                            item.type === 'INBOUND'
                                ? 'bg-green-900/40 border border-green-900 text-white'
                                : 'bg-red-500/40 border border-red-500 text-white'
                        )}
                    >
                        {item.type}
                    </div>
                )
            }
        },
        {
            header: 'Status',
            accessorKey: 'status',
            action: item => {
                return (
                    <div className='flex items-center justify-center'>
                        <div
                            className={`w-[100px] text-xs uppercase rounded-lg px-2 py-1 text-center ${
                                item.status === RECEIPT_STATUS.APPROVED
                                    ? 'bg-green-900 text-white'
                                    : item.status === RECEIPT_STATUS.CANCELLED
                                      ? 'bg-red-500 text-white'
                                      : 'bg-gray-500 text-white'
                            }`}
                        >
                            {item.status}
                        </div>
                    </div>
                )
            }
        },
        {
            header: 'Action',
            accessorKey: 'action',
            action: item => (
                <div className='flex gap-2'>
                    {item.status !== RECEIPT_STATUS.APPROVED &&
                    item.status !== RECEIPT_STATUS.CANCELLED ? (
                        <>
                            <Button variant='successSolid' onClick={() => acceptReceipt(item.id)}>
                                Accept
                            </Button>
                            <Button variant='destructive' onClick={() => rejectReceipt(item.id)}>
                                Reject
                            </Button>
                        </>
                    ) : (
                        <div className='w-[200px] text-xs uppercase rounded-lg px-2 py-1 text-center bg-gray-500/40 border border-gray-500 text-white'>
                            {item.confirmedBy} <br /> {item.confirmedAt}
                        </div>
                    )}
                    <Button variant='ghost' onClick={() => handleOpenDetailModal(item)}>
                        Detail
                    </Button>
                </div>
            )
        }
    ]

    const handleOpenDetailModal = (receipt: Receipt) => {
        openModal({
            title: `Receipt ${receipt.receiptNumber}`,
            content: <ReceipDetailModal receipt={receipt} />
        })
    }

    useEffect(() => {
        if (currentPage > 0) {
            fetchReceipts({
                page: currentPage,
                size: PAGE_SIZE
            })
        }
    }, [currentPage, fetchReceipts])

    return (
        <div>
            <h1 className='text-2xl font-bold'>Receipt Management</h1>
            <AppTable data={receipts} headers={receiptHeaders} />
            <AppPagination
                maxVisiblePages={PAGE_SIZE}
                totalDocs={receiptTotalDocs}
                currentPage={currentPage}
                onPageChange={page => setCurrentPage(page)}
            />
        </div>
    )
}

export default ReceiptManagement
