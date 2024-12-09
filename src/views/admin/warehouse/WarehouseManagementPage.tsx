import BaseLayout from '@/components/layout/BaseLayout'
import WarehouseProvider from '@/contexts/WarehouseContext'
import WarehouseManagement from './WarehouseManagement'
import ReceiptManagement from './ReceiptManagement'
import ShipmentManagement from './ShipmentManagement'
const WarehouseManagementPage = () => {
    return (
        <BaseLayout title='Warehouse Management'>
            <WarehouseProvider>
                <WarehouseManagement />
                <ReceiptManagement />
                <ShipmentManagement />
            </WarehouseProvider>
        </BaseLayout>
    )
}

export default WarehouseManagementPage
