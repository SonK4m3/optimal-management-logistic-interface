import UpdateUserInfoForm from './form/UpdateUserInfoForm'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const UpdateInfoWidget: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user)

    if (!user) return <div>Loading...</div>

    return (
        <div className='flex flex-col gap-2'>
            <UpdateUserInfoForm />
        </div>
    )
}

export default UpdateInfoWidget
