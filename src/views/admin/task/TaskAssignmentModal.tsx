import { useToast } from '@/components/ui/use-toast'
import { Staff, Task } from '@/types/resource'
import FormSelect from '@/components/FormSelect'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useModalContext } from '@/contexts/ModalContext'
import { useState } from 'react'
import RequestFactory from '@/services/RequestFactory'

interface TaskAssignmentModalProps {
    task: Task
    staffs: Staff[]
}

const TaskAssignmentModal = ({ task, staffs }: TaskAssignmentModalProps) => {
    const { closeModal } = useModalContext()
    const { toast } = useToast()
    const request = RequestFactory.getRequest('TaskRequest')

    const [staffId, setStaffId] = useState<number>(-1)
    const [note, setNote] = useState<string>('')

    const handleSubmit = async () => {
        try {
            const response = await request.assignTask({
                taskId: task.id,
                staffId,
                note
            })
            if (response) {
                toast({
                    title: 'Task assigned successfully',
                    variant: 'success'
                })
                closeModal()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <label htmlFor='staffId'>Staff</label>
                <FormSelect<string>
                    selected={
                        staffId === -1
                            ? undefined
                            : staffs.find(staff => staff.id === staffId)?.fullName
                    }
                    onSelect={value => {
                        const staff = staffs.find(staff => staff.fullName === value)
                        if (staff) {
                            setStaffId(staff.id)
                        }
                    }}
                    options={staffs.map(staff => staff.fullName)}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor='note'>Note</label>
                <Textarea id='note' value={note} onChange={e => setNote(e.target.value)} />
            </div>
            <div>
                <Button type='submit' onClick={handleSubmit}>
                    Assign
                </Button>
            </div>
        </div>
    )
}

export default TaskAssignmentModal
