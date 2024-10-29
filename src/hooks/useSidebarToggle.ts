import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { toggleSidebar } from '@/store/sidebarSlice'

export const useSidebarToggle = () => {
    const dispatch = useDispatch()
    const isOpen = useSelector((state: RootState) => state.sidebar.isOpen)

    const setIsOpen = () => {
        dispatch(toggleSidebar())
    }

    return {
        isOpen,
        setIsOpen
    }
}
