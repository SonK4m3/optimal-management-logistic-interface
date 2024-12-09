import { AppPagination } from '@/components/AppPagination'
import AppTable, { ColumnDef } from '@/components/AppTable'
import BaseLayout from '@/components/layout/BaseLayout'
import { Button } from '@/components/ui/button'
import { useModalContext } from '@/contexts/ModalContext'
import RequestFactory from '@/services/RequestFactory'
import { RootState } from '@/store'
import { OrderWithFee } from '@/types/order'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import OrderDetailModal from './OrderDetailModal'
import { Warehouse } from '@/types/warehouse'
import { DELIVERY_STATUS } from '@/constant/enum'

const PAGE_SIZE = 10

const ListOrderPage: React.FC = () => {
    const { openModal } = useModalContext()
    const request = RequestFactory.getRequest('OrderRequest')
    const warehouseRequest = RequestFactory.getRequest('WarehouseRequest')
    const user = useSelector((state: RootState) => state.user.user)

    const [currentPage, setCurrentPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(0)
    const [orders, setOrders] = useState<OrderWithFee[]>([])
    const [warehouses, setWarehouses] = useState<Warehouse[]>([])

    const orderHeaders: ColumnDef<OrderWithFee>[] = [
        { header: 'Order Code', accessorKey: 'orderCode' },
        {
            header: 'Delivery Status',
            accessorKey: 'delivery.status',
            action: (item: OrderWithFee) => {
                return (
                    <div
                        className={`px-2 py-1 rounded-md border ${
                            item.delivery?.status === DELIVERY_STATUS.DELIVERED
                                ? 'text-green-600 bg-green-50 border-green-200'
                                : item.delivery?.status === DELIVERY_STATUS.PENDING
                                  ? 'text-yellow-600 bg-yellow-50 border-yellow-200'
                                  : item.delivery?.status === DELIVERY_STATUS.IN_TRANSIT
                                    ? 'text-blue-600 bg-blue-50 border-blue-200'
                                    : item.delivery?.status === DELIVERY_STATUS.CANCELLED
                                      ? 'text-red-600 bg-red-50 border-red-200'
                                      : 'text-gray-600 bg-gray-50 border-gray-200'
                        } text-center`}
                    >
                        {item.delivery?.status}
                    </div>
                )
            }
        },
        { header: 'Priority', accessorKey: 'priority' },
        { header: 'Total Amount', accessorKey: 'totalAmount' },
        { header: 'Total Weight', accessorKey: 'totalWeight' },
        { header: 'Delivery Fee', accessorKey: 'deliveryFee.totalFee' },
        { header: 'Created At', accessorKey: 'createdAt' },
        {
            header: 'Action',
            accessorKey: 'action',
            action: (item: OrderWithFee) => {
                return (
                    <div className='flex items-center gap-2'>
                        <Button
                            onClick={() => {
                                openModal({
                                    title: 'Order Detail',
                                    content: (
                                        <OrderDetailModal order={item} warehouses={warehouses} />
                                    )
                                })
                            }}
                        >
                            View
                        </Button>
                    </div>
                )
            }
        }
    ]

    const fetchOrders = useCallback(async () => {
        if (!user?.id) return
        try {
            const response = await request.getOdersByUserWithFee({
                page: currentPage,
                limit: PAGE_SIZE
            })
            if (response.success) {
                setOrders(response.data.docs)
                setTotalDocs(response.data.totalDocs)
            }
        } catch (error) {
            console.log(error)
        }
    }, [currentPage, request, user?.id])

    const fetchWarehouses = useCallback(async () => {
        if (!user?.id) return
        try {
            const response = await warehouseRequest.getWarehouses()
            if (response.success) {
                setWarehouses(response.data.docs)
            }
        } catch (error) {
            console.log(error)
        }
    }, [user?.id, warehouseRequest])

    useEffect(() => {
        fetchOrders()
        fetchWarehouses()
    }, [currentPage, fetchOrders, fetchWarehouses, user?.id])

    return (
        <BaseLayout title='Orders' titleTab='OML | Orders'>
            <AppTable data={orders} headers={orderHeaders} />
            <AppPagination
                maxVisiblePages={PAGE_SIZE}
                totalDocs={totalDocs}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </BaseLayout>
    )
}

export default ListOrderPage
