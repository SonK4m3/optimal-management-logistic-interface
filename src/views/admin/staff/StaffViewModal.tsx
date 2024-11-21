import { Staff, TaskAssignment, ShiftAssignment } from '@/types/resource'
import RequestFactory from '@/services/RequestFactory'
import { useEffect, useState } from 'react'
import AppTable, { ColumnDef } from '@/components/AppTable'

interface ViewStaffModalProps {
    staff: Staff
}

const ViewStaffModal = ({ staff }: ViewStaffModalProps) => {
    const taskRequest = RequestFactory.getRequest('TaskRequest')
    const shiftRequest = RequestFactory.getRequest('ShiftRequest')

    const [tasks, setTasks] = useState<TaskAssignment[]>([])
    const [shifts, setShifts] = useState<ShiftAssignment[]>([])

    const taskHeaders: ColumnDef<TaskAssignment>[] = [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Title', accessorKey: 'task.title' },
        { header: 'Status', accessorKey: 'task.status' },
        { header: 'Created At', accessorKey: 'task.createdAt' }
    ]

    const shiftHeaders: ColumnDef<ShiftAssignment>[] = [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Shift', accessorKey: 'workShift.name' },
        { header: 'Work Date', accessorKey: 'workDate' },
        { header: 'Status', accessorKey: 'status' }
    ]

    const fetchTasks = async () => {
        try {
            const response = await taskRequest.getTasksByStaffId({
                staffId: staff.id,
                page: 1,
                size: 10
            })
            if (response.success) {
                setTasks(response.data.docs)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchShifts = async () => {
        try {
            const response = await shiftRequest.getShiftById({
                staffId: staff.id.toString(),
                page: 1,
                size: 10
            })
            if (response.success) {
                setShifts(response.data.docs)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTasks()
        fetchShifts()
    }, [])

    return (
        <div>
            <div>{staff.fullName}</div>
            <AppTable data={tasks} headers={taskHeaders} />
            <AppTable data={shifts} headers={shiftHeaders} />
        </div>
    )
}

export default ViewStaffModal
