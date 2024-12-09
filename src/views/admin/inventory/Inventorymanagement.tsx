import { useCallback, useEffect, useState } from 'react'
import { useModalContext } from '@/contexts/ModalContext'
import { Button } from '@/components/ui/button'
import AppTable, { ColumnDef } from '@/components/AppTable'
import { AppPagination } from '@/components/AppPagination'
import RequestFactory from '@/services/RequestFactory'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Inventory } from '@/types/inventory'
import ReceiptModal from './ReceiptModal'

const PAGE_SIZE = 10

const InventoryManagement = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const request = RequestFactory.getRequest('InventoryRequest')
    const { openModal } = useModalContext()
    const [currentPage, setCurrentPage] = useState(1)
    const [inventories, setInventories] = useState<Inventory[]>([])
    const [totalDocs, setTotalDocs] = useState(0)

    const inventoryHeaders: ColumnDef<Inventory>[] = [
        {
            header: 'Product Code',
            accessorKey: 'product.code'
        },
        {
            header: 'Product',
            accessorKey: 'product.name'
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity'
        },
        {
            header: 'Location',
            accessorKey: 'storageLocation.storageArea.name'
        },
        {
            header: 'Warehouse',
            accessorKey: 'storageLocation.storageArea.warehouse.name'
        }
    ]

    const fetchInventories = useCallback(async () => {
        if (!accessToken) return
        const response = await request.getInventories({
            page: currentPage,
            size: PAGE_SIZE
        })
        setInventories(response.data.docs)
        setTotalDocs(response.data.totalDocs)
    }, [accessToken, currentPage, request])

    const handleAddReceipt = (type: 'INBOUND' | 'OUTBOUND') => {
        openModal({
            title: `Create ${type} Receipt`,
            content: <ReceiptModal type={type} />
        })
    }

    useEffect(() => {
        fetchInventories()
    }, [fetchInventories])

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Inventory Management</h1>
                <div className='flex gap-2'>
                    <Button
                        variant='successGhost'
                        type='button'
                        onClick={() => handleAddReceipt('INBOUND')}
                    >
                        Inbound
                    </Button>
                    <Button
                        variant='accentGhost'
                        type='button'
                        onClick={() => handleAddReceipt('OUTBOUND')}
                    >
                        Outbound
                    </Button>
                </div>
            </div>
            <AppTable data={inventories} headers={inventoryHeaders} />
            <AppPagination
                maxVisiblePages={PAGE_SIZE}
                totalDocs={totalDocs}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default InventoryManagement
