import TimePicker from '@/components/TimePicker'
import { FormError } from '@/components/ui/form-error'
import { Input } from '@/components/ui/input'
import { ShiftFormValues, shiftSchema } from '@/schemas/shiftSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

interface CreateShiftFormProps {
    onSubmit: (data: ShiftFormValues) => void
    id: string
    length?: number
}

const CreateShiftForm = ({ onSubmit, id, length = 1 }: CreateShiftFormProps) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<ShiftFormValues>({
        resolver: zodResolver(shiftSchema),
        defaultValues: {
            name: `Shift ${length}`,
            startTime: '08:00:00',
            endTime: '17:00:00'
        }
    })
    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor='name'>Name</label>
                <Input {...register('name')} />
            </div>
            <div>
                <label className='block text-sm font-medium mb-1'>Start Time</label>
                <Controller
                    name='startTime'
                    control={control}
                    render={({ field }) => (
                        <TimePicker
                            value={field.value}
                            onChange={time => {
                                field.onChange(time)
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
                        <TimePicker
                            value={field.value}
                            onChange={time => {
                                field.onChange(time)
                            }}
                        />
                    )}
                />
                {errors.endTime && <FormError>{errors.endTime.message}</FormError>}
            </div>
        </form>
    )
}

export default CreateShiftForm
