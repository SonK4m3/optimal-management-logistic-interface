import DateTimePicker from '@/components/DateTimePicker'
import { FormError } from '@/components/ui/form-error'
import { Input } from '@/components/ui/input'
import { TaskFormValues, taskSchema } from '@/schemas/taskSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

interface CreateTaskFormProps {
    onSubmit: (data: TaskFormValues) => void
    id: string
    length?: number
}

const CreateTaskForm = ({ onSubmit, id, length = 1 }: CreateTaskFormProps) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: `Task ${length}`,
            description: `Description for Task ${length}`,
            startTime: '2024-11-19T00:00:00',
            endTime: '2024-11-19T00:00:00',
            priority: 'LOW'
        }
    })
    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor='title'>Title</label>
                <Input {...register('title')} />
            </div>
            <div>
                <label htmlFor='description'>Description</label>
                <Input {...register('description')} />
            </div>
            <div>
                <label className='block text-sm font-medium mb-1'>Start Time</label>
                <Controller
                    name='startTime'
                    control={control}
                    render={({ field }) => (
                        <DateTimePicker
                            value={new Date(field.value)}
                            onChange={time => {
                                field.onChange(time?.toISOString())
                            }}
                        />
                    )}
                />
                {errors.startTime && <FormError>{errors.startTime.message}</FormError>}
            </div>
            <div>
                <label className='block text-sm font-medium mb-1'>End Time</label>
                <Controller
                    name='endTime'
                    control={control}
                    render={({ field }) => (
                        <DateTimePicker
                            value={new Date(field.value)}
                            onChange={time => {
                                field.onChange(time?.toISOString())
                            }}
                        />
                    )}
                />
                {errors.endTime && <FormError>{errors.endTime.message}</FormError>}
            </div>
        </form>
    )
}

export default CreateTaskForm
