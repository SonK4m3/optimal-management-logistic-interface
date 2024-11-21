import { useToast } from '@/components/ui/use-toast'
import { Shift } from '@/types/resource'
import { Staff } from '@/types/resource'
import { useState } from 'react'
import { useModalContext } from '@/contexts/ModalContext'
import FormSelect from '@/components/FormSelect'
import RequestFactory from '@/services/RequestFactory'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'

interface ShiftAssignmentModalProps {
    shift: Shift
    staffs: Staff[]
}

export default function ShiftAssignmentModal({ shift, staffs }: ShiftAssignmentModalProps) {
    const { closeModal } = useModalContext()
    const { toast } = useToast()
    const request = RequestFactory.getRequest('ShiftRequest')

    const [staffIds, setStaffIds] = useState<number[]>([])
    const [note, setNote] = useState<string>('')

    const handleSubmit = async () => {
        try {
            const response = await request.batchCreateShift({
                shiftId: shift.id,
                staffIds,
                workDate: new Date().toISOString().split('T')[0],
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
                    selected={undefined}
                    onSelect={value => {
                        const staff = staffs.find(staff => staff.fullName === value)
                        if (staff && !staffIds.includes(staff.id)) {
                            setStaffIds(prev => [...prev, staff.id])
                        }
                    }}
                    options={staffs.map(staff => staff.fullName)}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <div>Selected Staffs</div>
                <div className='flex flex-col gap-2 max-h-[100px] overflow-y-auto'>
                    {staffIds.map(id => (
                        <div key={id} className='flex items-center gap-2'>
                            {staffs.find(staff => staff.id === id)?.fullName}{' '}
                            <Button
                                variant='destructive'
                                size='icon'
                                onClick={() => {
                                    const newStaffIds = staffIds.filter(prevId => prevId !== id)
                                    setStaffIds(newStaffIds)
                                }}
                            >
                                <XIcon className='w-4 h-4' />
                            </Button>
                        </div>
                    ))}
                </div>
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
