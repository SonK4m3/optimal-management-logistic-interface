import { AppPagination } from '@/components/AppPagination'
import AppTable, { ColumnDef } from '@/components/AppTable'
import BaseLayout from '@/components/layout/BaseLayout'
import RequestFactory from '@/services/RequestFactory'
import { RootState } from '@/store'
import { Order } from '@/types/order'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const PAGE_SIZE = 10

const ListOrderPage: React.FC = () => {
    const request = RequestFactory.getRequest('OrderRequest')
    const user = useSelector((state: RootState) => state.user.user)

    const [currentPage, setCurrentPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(0)
    const [orders, setOrders] = useState<Order[]>([])

    const orderHeaders: ColumnDef<Order>[] = [
        { header: 'Order Code', accessorKey: 'orderCode' },
        { header: 'Order Date', accessorKey: 'orderDate' },
        { header: 'Status', accessorKey: 'status' },
        { header: 'Priority', accessorKey: 'priority' },
        { header: 'Weight(kg)', accessorKey: 'weight' },
        { header: 'Payer', accessorKey: 'payer' }
    ]

    const fetchOrders = useCallback(async () => {
        if (!user?.id) return
        try {
            const response = await request.getOdersByUser({
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

    useEffect(() => {
        fetchOrders()
    }, [currentPage, fetchOrders])

    return (
        <BaseLayout title='Orders' titleTab='OML | Orders'>
            <div>
                <h1>Orders</h1>
                <AppTable data={orders} headers={orderHeaders} />
                <AppPagination
                    maxVisiblePages={PAGE_SIZE}
                    totalDocs={totalDocs}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </BaseLayout>
    )
}

export default ListOrderPage
