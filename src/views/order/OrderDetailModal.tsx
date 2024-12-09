import FlexLabelValue from '@/components/FlexLabelValue'
import { OrderWithFee } from '@/types/order'
import { Warehouse } from '@/types/warehouse'
import OrderMap from './OrderMap'

interface OrderDetailModalProps {
    order: OrderWithFee
    warehouses: Warehouse[]
}

export default function OrderDetailModal({ order, warehouses }: OrderDetailModalProps) {
    return (
        <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-2 gap-4 bg-slate-800 rounded-lg border p-4'>
                <FlexLabelValue label='Order Code' value={order.orderCode} />
                <FlexLabelValue label='Status' value={order.status} />
                <FlexLabelValue label='Priority' value={order.priority} />
                <FlexLabelValue label='Total Amount' value={order.totalAmount} />
                <FlexLabelValue label='Total Weight' value={order.totalWeight} />
                <FlexLabelValue label='Sub Total' value={order.subTotal} />
            </div>
            <div className='grid grid-cols-2 gap-4 bg-slate-800 rounded-lg border p-4'>
                <FlexLabelValue label='Base Fee' value={order.deliveryFee.baseFee} />
                <FlexLabelValue label='Weight Fee' value={order.deliveryFee.weightFee} />
                <FlexLabelValue label='Delivery Service' value={order.deliveryFee.surcharge} />
                <FlexLabelValue label='Delivery Service' value={order.deliveryFee.serviceType} />
                <FlexLabelValue label='Delivery Fee' value={order.deliveryFee.totalFee} />
            </div>
            <div className='grid grid-cols-2 gap-4 bg-slate-800 rounded-lg border p-4'>
                <FlexLabelValue
                    label='Pickup Location'
                    value={order.delivery?.deliveryLocation?.address}
                />
                <FlexLabelValue
                    label='Estimated Delivery Time'
                    value={order.delivery?.estimatedDeliveryTime}
                />
                <FlexLabelValue label='Delivery Note' value={order.delivery?.deliveryNote} />
                <FlexLabelValue label='Delivery Status' value={order.delivery?.status} />
                <FlexLabelValue label='Order Warehouse' value={order.delivery?.warehouseList} />
            </div>

            <OrderMap
                center={{
                    latitude: order.delivery?.deliveryLocation?.latitude,
                    longitude: order.delivery?.deliveryLocation?.longitude
                }}
                order={order}
                warehouses={warehouses.filter(warehouse =>
                    order.delivery?.warehouseList.includes(warehouse.id)
                )}
                drivers={[]}
            />
        </div>
    )
}
