import AppTable, { ColumnDef } from '@/components/AppTable'
import BaseLayout from '@/components/layout/BaseLayout'
import { Button } from '@/components/ui/button'
import CreateStaffForm from '../form/CreateStaffForm'
import { useModalContext } from '@/contexts/ModalContext'
import RequestFactory from '@/services/RequestFactory'
import { Staff } from '@/types/resource'
import { useCallback, useEffect, useState } from 'react'
import { StaffFormValues } from '@/schemas/staffSchema'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { toast } from '@/components/ui/use-toast'
import { AppPagination } from '@/components/AppPagination'
import ViewStaffModal from './StaffViewModal'

const StaffManagementPage = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const request = RequestFactory.getRequest('ResourceRequest')
    const authRequest = RequestFactory.getRequest('AuthRequest')
    const { openModal, closeModal } = useModalContext()
    const [currentPage, setCurrentPage] = useState(1)
    const [resources, setResources] = useState<Staff[]>([])

    const fetchStaff = useCallback(async () => {
        if (!accessToken) return

        try {
            const response = await request.getAllStaffs()
            setResources(response.data)
        } catch (error) {
            console.log(error)
        }
    }, [accessToken, request])

    const staffHeaders: ColumnDef<Staff>[] = [
        {
            header: 'ID',
            accessorKey: 'id'
        },
        {
            header: 'Username',
            accessorKey: 'username'
        },
        {
            header: 'Position',
            accessorKey: 'position'
        },
        {
            header: 'Action',
            accessorKey: 'action',
            action: (staff: Staff) => (
                <Button variant='primary' onClick={() => handleViewStaff(staff)}>
                    View
                </Button>
            )
        }
    ]

    const handleSubmit = async (data: StaffFormValues) => {
        try {
            const response = await authRequest.register({
                username: data.username,
                email: data.email,
                fullName: data.fullName,
                password: data.password,
                role: 'STAFF'
            })
            if (response.success) {
                toast({
                    title: 'Staff created successfully',
                    variant: 'success'
                })
                fetchStaff()
                closeModal()
            }
        } catch (error) {
            closeModal()
            console.log(error)
        }
    }

    const handleAddStaff = () => {
        openModal({
            title: 'Add Staff',
            content: (
                <CreateStaffForm
                    onSubmit={handleSubmit}
                    id='create-staff-form'
                    length={resources.length + 1}
                />
            ),
            footer: (
                <Button variant='accentGhost' type='submit' form='create-staff-form'>
                    Add
                </Button>
            )
        })
    }

    const handleViewStaff = (staff: Staff) => {
        openModal({
            title: 'View Staff',
            content: <ViewStaffModal staff={staff} />
        })
    }

    useEffect(() => {
        fetchStaff()
    }, [])

    return (
        <BaseLayout title='List of Staffs'>
            <div>
                <div className='flex justify-between items-center'>
                    <h1>StaffManagement</h1>
                    <div className='flex gap-2'>
                        <Button variant='brand' onClick={handleAddStaff}>
                            Add Staff
                        </Button>
                    </div>
                </div>
                <AppTable data={resources} headers={staffHeaders} />
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

export default StaffManagementPage
