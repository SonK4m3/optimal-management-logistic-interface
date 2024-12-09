import { driverSchema } from '@/schemas/driverSchema'
import { DriverFormData } from '@/schemas/driverSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { VEHICLE_TYPE } from '@/constant/enum'
import FormSelect from '@/components/FormSelect'
import ColLabelValue from '@/components/ColLabelValue'

type CreateDriverFormProps = {
    id?: string
    onSubmit: (data: DriverFormData) => void
    length?: number
}

const CreateDriverForm = ({ id, onSubmit, length = 1 }: CreateDriverFormProps) => {
    const { register, handleSubmit, watch, setValue } = useForm<DriverFormData>({
        resolver: zodResolver(driverSchema),
        defaultValues: {
            username: `driver${length}`,
            email: `driver${length}@gmail.com`,
            fullName: `Driver ${length}`,
            password: '123456',
            phone: '0' + Math.floor(Math.random() * 900000000 + 100000000).toString(),
            licenseNumber: '1234567890',
            vehicleType: VEHICLE_TYPE.MOTORCYCLE,
            vehiclePlate: '1234567890'
        }
    })

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            id={id || 'create-driver-form'}
            className='grid grid-cols-2 gap-4'
        >
            <ColLabelValue label='Username' value={<Input {...register('username')} />} />
            <ColLabelValue label='Email' value={<Input {...register('email')} />} />
            <ColLabelValue label='Full Name' value={<Input {...register('fullName')} />} />
            <ColLabelValue
                label='Password'
                value={<Input type='password' {...register('password')} />}
            />
            <ColLabelValue label='Phone' value={<Input {...register('phone')} />} />
            <ColLabelValue
                label='License Number'
                value={<Input {...register('licenseNumber')} />}
            />
            <ColLabelValue
                label='Vehicle Type'
                value={
                    <FormSelect
                        selected={watch('vehicleType')}
                        options={Object.values(VEHICLE_TYPE).map(type => ({
                            label: type,
                            value: type
                        }))}
                        onSelect={value => setValue('vehicleType', value)}
                    />
                }
            />
            <ColLabelValue label='Vehicle Plate' value={<Input {...register('vehiclePlate')} />} />
        </form>
    )
}

export default CreateDriverForm
