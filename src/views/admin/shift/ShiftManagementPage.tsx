import AppTable, { ColumnDef } from '@/components/AppTable'
import BaseLayout from '@/components/layout/BaseLayout'
import { Button } from '@/components/ui/button'
import RequestFactory from '@/services/RequestFactory'
import { Shift, Staff } from '@/types/resource'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { AppPagination } from '@/components/AppPagination'
import { ShiftFormValues } from '@/schemas/shiftSchema'
import { toast } from '@/components/ui/use-toast'
import CreateShiftForm from '../form/CreateShiftForm'
import { useModalContext } from '@/contexts/ModalContext'
import ShiftAssignmentModal from './ShiftAssignmentModal'

const ShiftManagementPage = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const request = RequestFactory.getRequest('ShiftRequest')
    const resourceRequest = RequestFactory.getRequest('ResourceRequest')

    const { openModal, closeModal } = useModalContext()
    const [currentPage, setCurrentPage] = useState(1)
    const [shifts, setShifts] = useState<Shift[]>([])
    const [staffs, setStaffs] = useState<Staff[]>([])

    const fetchShifts = useCallback(async () => {
        if (!accessToken) return

        try {
            const response = await request.getAllShifts({ page: currentPage, size: 10 })
            setShifts(response.data.docs)
        } catch (error) {
            console.log(error)
            setShifts([])
        }
    }, [accessToken, request, currentPage])

    const shiftHeaders: ColumnDef<Shift>[] = [
        {
            header: 'ID',
            accessorKey: 'id'
        },
        {
            header: 'Shift Name',
            accessorKey: 'name'
        },
        {
            header: 'Start Time',
            accessorKey: 'startTime'
        },
        {
            header: 'End Time',
            accessorKey: 'endTime'
        },
        {
            header: 'Staffs',
            accessorKey: 'shiftAssignments.staffName',
            action: shift => (
                <div className='line-clamp-1'>
                    {shift.shiftAssignments.map(assignment => assignment.staffName).join(', ')}
                </div>
            )
        },
        {
            header: 'Action',
            accessorKey: 'action',
            action: shift => (
                <Button variant='successGhost' onClick={() => handleAssignShift(shift)}>
                    Assign
                </Button>
            )
        }
    ]

    const handleSubmit = async (data: ShiftFormValues) => {
        console.log(data)
        try {
            const response = await request.createShift({
                name: data.name,
                startTime: data.startTime,
                endTime: data.endTime
            })
            if (response.success) {
                toast({
                    title: 'Shift created successfully',
                    variant: 'success'
                })
                fetchShifts()
                closeModal()
            }
        } catch (error) {
            closeModal()
            console.log(error)
        }
    }

    const handleAssignShift = async (shift: Shift) => {
        openModal({
            title: 'Assign Shift',
            content: <ShiftAssignmentModal shift={shift} staffs={staffs} />
        })
    }

    const handleAddShift = () => {
        openModal({
            title: 'Add Shift',
            content: (
                <CreateShiftForm
                    onSubmit={handleSubmit}
                    id='create-shift-form'
                    length={shifts.length ? shifts.length + 1 : 1}
                />
            ),
            footer: (
                <Button variant='accentGhost' type='submit' form='create-shift-form'>
                    Add
                </Button>
            )
        })
    }

    const fetchStaffs = useCallback(async () => {
        if (!accessToken) return

        try {
            const response = await resourceRequest.getAllStaffs()
            if (response.success) {
                setStaffs(response.data)
            }
        } catch {
            setStaffs([])
        }
    }, [accessToken, resourceRequest])

    useEffect(() => {
        fetchShifts()
        fetchStaffs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <BaseLayout title='Shift Management'>
            <div>
                <div className='flex justify-between items-center'>
                    <h1>Shift Management</h1>
                    <div className='flex gap-2'>
                        <Button variant='brand' onClick={handleAddShift}>
                            Add Shift
                        </Button>
                    </div>
                </div>
                <AppTable data={shifts} headers={shiftHeaders} />
                <AppPagination
                    maxVisiblePages={10}
                    totalDocs={shifts.length}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </BaseLayout>
    )
}

export default ShiftManagementPage
