import UnAuthorizationPage from '@/components/UnAuthorizationPage.tsx'
import { useAuthContext } from '@/contexts/AuthContext'
import { Outlet } from 'react-router-dom'

const AuthorizeRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { isLogin } = useAuthContext()

    if (!isLogin) {
        return <UnAuthorizationPage />
    }

    if (children) {
        return <>{children}</>
    }

    return <Outlet />
}

export default AuthorizeRoute
