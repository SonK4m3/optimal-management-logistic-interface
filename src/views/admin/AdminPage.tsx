import BaseLayout from '@/components/layout/BaseLayout'
import ModalContext from '@/contexts/ModalContext'
import AdminProvider from '@/contexts/AdminContext'
import PlanManagement from './PlanManagement'
import AdminMap from './AdminMap'

const AdminPage: React.FC = () => {
    return (
        <ModalContext>
            <AdminProvider>
                <BaseLayout title='Admin' titleTab='OML | Admin'>
                    <div className='w-full flex gap-4'>
                        <div className='w-[50%]'>
                            <PlanManagement />
                        </div>
                        <div className='w-[50%]'>
                            <AdminMap />
                        </div>
                    </div>
                </BaseLayout>
            </AdminProvider>
        </ModalContext>
    )
}

export default AdminPage
