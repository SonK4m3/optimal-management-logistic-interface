import AppTable, { ColumnDef } from '@/components/AppTable'
import BaseLayout from '@/components/layout/BaseLayout'
import RequestFactory from '@/services/RequestFactory'
import { Customer } from '@/types/resource'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { AppPagination } from '@/components/AppPagination'

const CustomerManagementPage = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const request = RequestFactory.getRequest('ResourceRequest')
    const [currentPage, setCurrentPage] = useState(1)
    const [resources, setResources] = useState<Customer[]>([])

    const fetchCustomers = useCallback(async () => {
        if (!accessToken) return

        try {
            const response = await request.getAllCustomers()
            setResources(response.data)
        } catch (error) {
            console.log(error)
        }
    }, [accessToken, request])

    const customerHeaders: ColumnDef<Customer>[] = [
        {
            header: 'ID',
            accessorKey: 'id'
        },
        {
            header: 'Username',
            accessorKey: 'username'
        },
        {
            header: 'Email',
            accessorKey: 'email'
        }
    ]

    useEffect(() => {
        fetchCustomers()
    }, [])

    return (
        <BaseLayout title='List of Customers'>
            <div>
                <div className='flex justify-between items-center'>
                    <h1>Customer Management</h1>
                    <div className='flex gap-2'></div>
                </div>
                <AppTable data={resources} headers={customerHeaders} />
                <AppPagination
                    maxVisiblePages={10}
                    totalDocs={resources.length}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </BaseLayout>
    )
}

export default CustomerManagementPage
