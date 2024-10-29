import BaseLayout from '@/components/layout/BaseLayout'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import DateTimePicker from '@/components/DateTimePicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input' // Importing Input from shadcn ui

// Define the form schema using Zod
const orderSchema = z.object({
    sender: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        phone: z.string().min(10, 'Please enter a valid phone number'),
        address: z.string().min(5, 'Please enter a valid address')
    }),
    receiver: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        phone: z.string().min(10, 'Please enter a valid phone number'),
        address: z.string().min(5, 'Please enter a valid address')
    }),
    appointmentTime: z.date(),
    receiveAt: z.date()
})

// Infer TypeScript type from schema
type OrderFormData = z.infer<typeof orderSchema>

const CreateOrderPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            sender: { name: '', phone: '', address: '' },
            receiver: { name: '', phone: '', address: '' },
            appointmentTime: new Date(),
            receiveAt: new Date()
        }
    })

    const onSubmit = (data: OrderFormData) => {
        console.log('Form data:', data)
        // Handle form submission here
    }

    return (
        <BaseLayout title='Create Order' titleTab='OML | Create Order'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 max-w-2xl mx-auto p-6'>
                {/* Sender Section */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Sender Information</h2>
                    <Input
                        placeholder='Sender Name'
                        {...register('sender.name')}
                        className={errors.sender?.name ? 'border-red-500' : ''}
                    />
                    <p className='text-red-500'>{errors.sender?.name?.message}</p>
                    <Input
                        placeholder='Sender Phone'
                        {...register('sender.phone')}
                        className={errors.sender?.phone ? 'border-red-500' : ''}
                    />
                    <p className='text-red-500'>{errors.sender?.phone?.message}</p>
                    <Input
                        placeholder='Sender Address'
                        {...register('sender.address')}
                        className={errors.sender?.address ? 'border-red-500' : ''}
                    />
                    <p className='text-red-500'>{errors.sender?.address?.message}</p>
                </div>

                {/* Receiver Section */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Receiver Information</h2>
                    <Input
                        placeholder='Receiver Name'
                        {...register('receiver.name')}
                        className={errors.receiver?.name ? 'border-red-500' : ''}
                    />
                    <p className='text-red-500'>{errors.receiver?.name?.message}</p>
                    <Input
                        placeholder='Receiver Phone'
                        {...register('receiver.phone')}
                        className={errors.receiver?.phone ? 'border-red-500' : ''}
                    />
                    <p className='text-red-500'>{errors.receiver?.phone?.message}</p>
                    <Input
                        placeholder='Receiver Address'
                        {...register('receiver.address')}
                        className={errors.receiver?.address ? 'border-red-500' : ''}
                    />
                    <p className='text-red-500'>{errors.receiver?.address?.message}</p>
                </div>

                {/* Date Time Section */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Schedule Information</h2>
                    <DateTimePicker value={undefined} onChange={() => {}} />
                </div>

                <Button type='submit' variant='default'>
                    Create Order
                </Button>
            </form>
        </BaseLayout>
    )
}

export default CreateOrderPage
