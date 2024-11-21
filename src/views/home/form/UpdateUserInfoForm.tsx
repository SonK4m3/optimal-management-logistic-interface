import { useHomePageContext } from '@/contexts/HomePageContext'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Button } from '@/components/ui/button'
const UpdateUserInfoForm: React.FC = () => {
    const { updateCustomerInfo } = useHomePageContext()
    const user = useSelector((state: RootState) => state.user.user)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!user) return

        updateCustomerInfo(user.id, {
            phone: '1234567890',
            address: {
                address: '123 Main St',
                city: 'Anytown',
                country: 'USA',
                isDefault: true,
                addressType: 'HOME',
                recipientInfo: 'John Doe'
            }
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                <div className='flex gap-2'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='phone'>Phone</label>
                        <input
                            type='text'
                            id='phone'
                            className='rounded-md text-neutral-800 px-4 py-2'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='address'>Address</label>
                        <input
                            type='text'
                            id='address'
                            className='rounded-md text-neutral-800 px-4 py-2'
                        />
                    </div>
                </div>
                <div className='flex gap-2'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='city'>City</label>
                        <input
                            type='text'
                            id='city'
                            className='rounded-md text-neutral-800 px-4 py-2'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='country'>Country</label>
                        <input
                            type='text'
                            id='country'
                            className='rounded-md text-neutral-800 px-4 py-2'
                        />
                    </div>
                </div>
                <div className='flex gap-2'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='recipientInfo'>Recipient Info</label>
                        <input
                            type='text'
                            id='recipientInfo'
                            className='rounded-md text-neutral-800 px-4 py-2'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='addressType'>Address Type</label>
                        <input
                            type='text'
                            id='addressType'
                            className='rounded-md text-neutral-800 px-4 py-2'
                        />
                    </div>
                </div>

                <div>
                    <Button variant='primary' type='submit'>
                        Update
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default UpdateUserInfoForm
