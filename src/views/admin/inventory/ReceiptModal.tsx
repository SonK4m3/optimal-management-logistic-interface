import CreateReceiptForm from '@/views/admin/form/CreateReceiptForm'
import { useModalContext } from '@/contexts/ModalContext'
import { CheckWarehouseSpace, Warehouse } from '@/types/warehouse'
import { useEffect, useState } from 'react'
import RequestFactory from '@/services/RequestFactory'
import FormSelect from '@/components/FormSelect'
import { toast } from '@/components/ui/use-toast'
import CreateShipmentForm from '../form/CreateShipmentForm'

interface ReceiptModalProps {
    type: 'INBOUND' | 'OUTBOUND'
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ type }) => {
    const { closeModal } = useModalContext()
    const [warehouse, setWarehouse] = useState<Warehouse | null>(null)
    const [warehouses, setWarehouses] = useState<Warehouse[]>([])
    const request = RequestFactory.getRequest('WarehouseRequest')
    const [warehouseSpace, setWarehouseSpace] = useState<CheckWarehouseSpace | null>(null)

    const fetchWarehouses = async () => {
        const { data } = await request.getWarehouses()
        setWarehouses(data.docs)
    }

    const checkWarehouseSpace = async (warehouseId: string) => {
        try {
            const { data } = await request.checkWarehouseSpace(warehouseId)
            setWarehouseSpace(data)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to check warehouse space',
                variant: 'destructive'
            })
        }
    }

    const handleSelectWarehouse = async (value: string) => {
        const warehouse = warehouses.find(warehouse => warehouse.name === value) || null
        if (warehouse) {
            setWarehouse(warehouse)
            await checkWarehouseSpace(warehouse.id.toString())
        }
    }

    useEffect(() => {
        fetchWarehouses()
    }, [])

    return (
        <div className='flex flex-col gap-4'>
            <FormSelect
                selected={warehouse?.name}
                onSelect={value => {
                    handleSelectWarehouse(value)
                }}
                options={warehouses.map(warehouse => ({
                    label: warehouse.name,
                    value: warehouse.name
                }))}
            />
            <div className='flex gap-4'>
                <div className='flex-1 flex flex-col gap-2'>
                    <p>Total Area: {warehouseSpace?.totalArea}</p>
                    <p>Used Area: {warehouseSpace?.usedArea}</p>
                    <p>Available Area: {warehouseSpace?.availableArea}</p>
                </div>
                <div className='flex-1flex flex-col gap-2'>
                    <p>Total Capacity: {warehouseSpace?.totalCapacity}</p>
                    <p>Used Capacity: {warehouseSpace?.usedCapacity}</p>
                    <p>Available Capacity: {warehouseSpace?.availableCapacity}</p>
                </div>
            </div>
            {warehouse ? (
                type === 'INBOUND' ? (
                    <CreateReceiptForm
                        availableArea={warehouseSpace?.availableArea}
                        availableCapacity={warehouseSpace?.availableCapacity}
                        warehouse={warehouse}
                        id='create-receipt-form'
                        onSuccess={() => {
                            closeModal()
                        }}
                        type={type}
                    />
                ) : (
                    <CreateShipmentForm
                        warehouse={warehouse}
                        id='create-shipment-form'
                        onSuccess={() => {
                            closeModal()
                        }}
                    />
                )
            ) : (
                <div>Please select a warehouse</div>
            )}
        </div>
    )
}

export default ReceiptModal
