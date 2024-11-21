import { useSelector } from 'react-redux'
import { RootState } from '@/store'
const UserInfoWidget: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user)

    if (!user) return <div>Loading...</div>

    return (
        <div className='flex flex-col gap-2'>
            <div>{user.username}</div>
            <div>{user.email}</div>
            <div>{user.role}</div>
        </div>
    )
}

export default UserInfoWidget
