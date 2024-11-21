import AppTable, { ColumnDef } from '@/components/AppTable'
import BaseLayout from '@/components/layout/BaseLayout'
import { Button } from '@/components/ui/button'
import RequestFactory from '@/services/RequestFactory'
import { Staff, Task } from '@/types/resource'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { AppPagination } from '@/components/AppPagination'
import { useModalContext } from '@/contexts/ModalContext'
import { TaskFormValues } from '@/schemas/taskSchema'
import { toast } from '@/components/ui/use-toast'
import CreateTaskForm from '../form/CreateTaskForm'
import TaskAssignmentModal from './TaskAssignmentModal'

const TaskManagementPage = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const request = RequestFactory.getRequest('TaskRequest')
    const resourceRequest = RequestFactory.getRequest('ResourceRequest')

    const { openModal, closeModal } = useModalContext()
    const [currentPage, setCurrentPage] = useState(1)
    const [tasks, setTasks] = useState<Task[]>([])
    const [staffs, setStaffs] = useState<Staff[]>([])

    const fetchTasks = useCallback(async () => {
        if (!accessToken) return

        try {
            const response = await request.getTasks({ page: currentPage, size: 10 })
            if (response.success) {
                setTasks(response.data.docs)
            }
        } catch (error) {
            console.log(error)
        }
    }, [accessToken, request, currentPage])

    const taskHeaders: ColumnDef<Task>[] = [
        {
            header: 'ID',
            accessorKey: 'id'
        },
        {
            header: 'Task Name',
            accessorKey: 'title'
        },
        {
            header: 'Description',
            accessorKey: 'description'
        },
        {
            header: 'Action',
            accessorKey: 'action',
            action: task => (
                <Button variant='successGhost' onClick={() => handleAssignTask(task)}>
                    Assign
                </Button>
            )
        }
    ]

    const handleSubmit = async (data: TaskFormValues) => {
        try {
            const response = await request.createTask({
                title: data.title,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
                priority: data.priority
            })
            if (response.success) {
                toast({
                    title: 'Task created successfully',
                    variant: 'success'
                })
                fetchTasks()
                closeModal()
            }
        } catch (error) {
            closeModal()
            console.log(error)
        }
    }

    const handleAssignTask = async (task: Task) => {
        openModal({
            title: 'Assign Task',
            content: <TaskAssignmentModal task={task} staffs={staffs} />
        })
    }

    const handleAddTask = () => {
        openModal({
            title: 'Add Task',
            content: (
                <CreateTaskForm
                    onSubmit={handleSubmit}
                    id='create-task-form'
                    length={tasks.length + 1}
                />
            ),
            footer: (
                <Button variant='accentGhost' type='submit' form='create-task-form'>
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
        fetchTasks()
        fetchStaffs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <BaseLayout title='Task Management'>
            <div>
                <div className='flex justify-between items-center'>
                    <h1>Task Management</h1>
                    <div className='flex gap-2'>
                        <Button variant='brand' onClick={handleAddTask}>
                            Add Task
                        </Button>
                    </div>
                </div>
                <AppTable data={tasks} headers={taskHeaders} />
                <AppPagination
                    maxVisiblePages={10}
                    totalDocs={tasks.length}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </BaseLayout>
    )
}

export default TaskManagementPage
