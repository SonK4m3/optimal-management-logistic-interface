import { Input } from '@/components/ui/input'
import { StaffFormValues, staffSchema } from '@/schemas/staffSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface CreateStaffFormProps {
    onSubmit: (data: StaffFormValues) => void
    id: string
    length?: number
}

const CreateStaffForm = ({ onSubmit, id, length = 1 }: CreateStaffFormProps) => {
    const { register, handleSubmit } = useForm<StaffFormValues>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            username: `staff${length}`,
            email: `staff${length}@gmail.com`,
            fullName: `Staff ${length}`,
            password: '123456'
        }
    })
    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor='username'>Username</label>
                <Input {...register('username')} />
            </div>
            <div>
                <label htmlFor='email'>Email</label>
                <Input {...register('email')} />
            </div>
            <div>
                <label htmlFor='fullName'>Full Name</label>
                <Input {...register('fullName')} />
            </div>
            <div>
                <label htmlFor='password'>Password</label>
                <Input {...register('password')} />
            </div>
        </form>
    )
}

export default CreateStaffForm
