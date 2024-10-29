import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import useComingSoon from '@/hooks/useComingSoon'

const AddBotButton: React.FC = () => {
    const navigate = useNavigate()
    const { showComingSoon } = useComingSoon()

    return (
        <div className='flex justify-end gap-4'>
            <Button variant={'transparent'} size={'sm'} onClick={() => navigate('/bots/create')}>
                <Plus size={16} /> Start new Bot
            </Button>
            <Button variant={'emerald'} size={'sm'} onClick={showComingSoon}>
                Get full access
            </Button>
        </div>
    )
}

export default AddBotButton
