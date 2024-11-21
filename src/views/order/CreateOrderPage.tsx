import BaseLayout from '@/components/layout/BaseLayout'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FormSelect from '@/components/FormSelect'
import { OrderRequestPayload } from '@/types/request'
import RequestFactory from '@/services/RequestFactory'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useEffect, useState } from 'react'
import { useCallback } from 'react'
import { Warehouse } from '@/types/warehouse'
import { toast } from '@/components/ui/use-toast'
import { orderSchema, OrderSchemaType } from '@/schemas/orderSchema'
import { CargoType, PayerType, ServiceType, PickupTimeType } from '@/types/order'
import { SERVICE_TYPE, CARGO_TYPE, PAYER_TYPE, PICKUP_TIME_TYPE } from '@/constant/enum'
import AppMap from '@/components/AppMap'

const CreateOrderPage: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user)

    const OrderRequest = RequestFactory.getRequest('OrderRequest')
    const warehouseRequest = RequestFactory.getRequest('WarehouseRequest')

    const [warehouses, setWarehouses] = useState<Warehouse[]>([])

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<OrderSchemaType>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            orderProducts: [
                {
                    name: 'Product 1',
                    price: 10000,
                    quantity: 1,
                    weight: 100
                }
            ],
            receiverName: 'Nguyen Van A',
            receiverPhone: '0909090909',
            receiverAddress: '123 Nguyen Van A, Ha Noi',
            receiverLatitude: 10.762622,
            receiverLongitude: 106.660172,
            pickupTime: PICKUP_TIME_TYPE.MORNING,
            serviceType: SERVICE_TYPE.STANDARD,
            cargoType: CARGO_TYPE.GENERAL,
            payer: PAYER_TYPE.SENDER,
            pickupWarehouseId: 1,
            deliveryNote: 'AAAA'
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'orderProducts'
    })

    const onSubmit = async (data: OrderSchemaType) => {
        const payload: OrderRequestPayload = {
            senderId: user?.id || 0,
            receiverName: data.receiverName,
            receiverPhone: data.receiverPhone,
            receiverAddress: data.receiverAddress,
            receiverLatitude: data.receiverLatitude,
            receiverLongitude: data.receiverLongitude,
            orderProducts: data.orderProducts,
            pickupTime: data.pickupTime,
            serviceType: data.serviceType as ServiceType,
            cargoType: data.cargoType as CargoType,
            payer: data.payer as PayerType,
            pickupWarehouseId: data.pickupWarehouseId,
            deliveryNote: data.deliveryNote
        }
        try {
            const response = await OrderRequest.createOrder(payload)
            if (response.success) {
                toast({
                    variant: 'success',
                    title: 'Order created successfully',
                    description: 'Order code: ' + response.data.orderCode
                })
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: `${(error as Error).message}`
            })
        }
    }

    const fetchWarehouses = useCallback(async () => {
        const response = await warehouseRequest.getWarehouses()
        setWarehouses(response.data)
    }, [warehouseRequest])

    useEffect(() => {
        fetchWarehouses()
    }, [])

    return (
        <BaseLayout title='Create Order' titleTab='OML | Create Order'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 max-w-2xl mx-auto p-6'>
                <Button type='submit' variant='default'>
                    Create Order
                </Button>
                {/* Receiver Information */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Receiver Information</h2>
                    <Input
                        placeholder='Receiver Name'
                        {...register('receiverName')}
                        className={errors.receiverName ? 'border-red-500' : ''}
                    />
                    <p className='text-red-500'>{errors.receiverName?.message}</p>
                    <Input
                        placeholder='Receiver Phone'
                        {...register('receiverPhone')}
                        className={errors.receiverPhone ? 'border-red-500' : ''}
                    />
                    <p className='text-red-500'>{errors.receiverPhone?.message}</p>
                    <Input
                        placeholder='Receiver Address'
                        {...register('receiverAddress')}
                        className={errors.receiverAddress ? 'border-red-500' : ''}
                    />
                    <p className='text-red-500'>{errors.receiverAddress?.message}</p>
                </div>

                <AppMap
                    center={[10.762622, 106.660172]}
                    zoom={13}
                    currentMarker={{
                        lat: watch('receiverLatitude'),
                        lng: watch('receiverLongitude')
                    }}
                    onMarkerClick={marker => {
                        setValue('receiverLatitude', marker.lat)
                        setValue('receiverLongitude', marker.lng)
                    }}
                />

                {/* Products Section */}
                <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-semibold'>Products</h2>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() =>
                                append({
                                    name: '',
                                    price: 0,
                                    quantity: 1,
                                    weight: 0
                                })
                            }
                        >
                            Add Product
                        </Button>
                    </div>

                    {fields.map((field, index) => (
                        <div key={field.id} className='space-y-4 p-4 border rounded relative'>
                            <div className='grid grid-cols-4 gap-6'>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Product Name</label>
                                    <Input
                                        placeholder='Enter product name'
                                        {...register(`orderProducts.${index}.name`)}
                                        className={
                                            errors.orderProducts?.[index]?.name
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    <p className='text-xs text-red-500'>
                                        {errors.orderProducts?.[index]?.name?.message}
                                    </p>
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Price (VND)</label>
                                    <Input
                                        type='number'
                                        placeholder='Enter price'
                                        {...register(`orderProducts.${index}.price`, {
                                            valueAsNumber: true
                                        })}
                                        className={
                                            errors.orderProducts?.[index]?.price
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    <p className='text-xs text-red-500'>
                                        {errors.orderProducts?.[index]?.price?.message}
                                    </p>
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Quantity</label>
                                    <Input
                                        type='number'
                                        placeholder='Enter quantity'
                                        {...register(`orderProducts.${index}.quantity`, {
                                            valueAsNumber: true
                                        })}
                                        className={
                                            errors.orderProducts?.[index]?.quantity
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    <p className='text-xs text-red-500'>
                                        {errors.orderProducts?.[index]?.quantity?.message}
                                    </p>
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Weight (gram)</label>
                                    <Input
                                        type='number'
                                        placeholder='Enter weight'
                                        {...register(`orderProducts.${index}.weight`, {
                                            valueAsNumber: true
                                        })}
                                        className={
                                            errors.orderProducts?.[index]?.weight
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    <p className='text-xs text-red-500'>
                                        {errors.orderProducts?.[index]?.weight?.message}
                                    </p>
                                </div>
                            </div>

                            {fields.length > 1 && (
                                <Button
                                    type='button'
                                    variant='destructive'
                                    size='sm'
                                    className='absolute -top-3 -right-3 rounded-full'
                                    onClick={() => remove(index)}
                                >
                                    ×
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Summary Section */}
                <div className='space-y-4'>
                    <div className='flex justify-between items-center'>
                        <span className='font-medium'>Total Products:</span>
                        <span>{fields.length}</span>
                    </div>

                    <div className='flex justify-between items-center'>
                        <span className='font-medium'>Total Weight:</span>
                        <span>
                            {fields.reduce((acc, _, index) => {
                                const weight =
                                    Number(control._formValues.orderProducts[index]?.weight) || 0
                                const quantity =
                                    Number(control._formValues.orderProducts[index]?.quantity) || 0
                                return acc + weight * quantity
                            }, 0)}{' '}
                            gram
                        </span>
                    </div>

                    <div className='flex justify-between items-center'>
                        <span className='font-medium'>Total Amount:</span>
                        <span>
                            {fields
                                .reduce((acc, _, index) => {
                                    const price =
                                        Number(control._formValues.orderProducts[index]?.price) || 0
                                    const quantity =
                                        Number(
                                            control._formValues.orderProducts[index]?.quantity
                                        ) || 0
                                    return acc + price * quantity
                                }, 0)
                                .toLocaleString()}{' '}
                            VND
                        </span>
                    </div>
                </div>

                {/* Pickup Time */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Pickup Time</h2>
                    <FormSelect
                        selected={watch('pickupTime')}
                        options={Object.values(PICKUP_TIME_TYPE)}
                        onSelect={value => setValue('pickupTime', value as PickupTimeType)}
                    />
                    <p className='text-red-500'>{errors.pickupTime?.message}</p>
                </div>

                {/* Service Type */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Service Type</h2>
                    <FormSelect
                        selected={watch('serviceType')}
                        options={Object.values(SERVICE_TYPE)}
                        onSelect={value => setValue('serviceType', value as ServiceType)}
                    />
                    <p className='text-red-500'>{errors.serviceType?.message}</p>
                </div>

                {/* Cargo Type */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Cargo Type</h2>
                    <FormSelect
                        selected={watch('cargoType')}
                        options={Object.values(CARGO_TYPE)}
                        onSelect={value => setValue('cargoType', value as CargoType)}
                    />
                    <p className='text-red-500'>{errors.cargoType?.message}</p>
                </div>

                {/* Payer */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Payer</h2>
                    <div className='flex space-x-4'>
                        <label className='flex items-center space-x-2'>
                            <input type='radio' value='SENDER' {...register('payer')} />
                            <span>Sender</span>
                        </label>
                        <label className='flex items-center space-x-2'>
                            <input type='radio' value='RECEIVER' {...register('payer')} />
                            <span>Receiver</span>
                        </label>
                    </div>
                    <p className='text-red-500'>{errors.payer?.message}</p>
                </div>

                {/* Pickup Warehouse */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Pickup Warehouse</h2>
                    <FormSelect
                        selected={String(watch('pickupWarehouseId'))}
                        options={warehouses.map(w => String(w.id))}
                        onSelect={value => setValue('pickupWarehouseId', Number(value))}
                    />
                    <p className='text-red-500'>{errors.pickupWarehouseId?.message}</p>
                </div>

                {/* Delivery Note */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Delivery Note</h2>
                    <textarea
                        className='w-full p-2 border rounded-md bg-transparent'
                        rows={3}
                        placeholder='Enter delivery notes if any...'
                        {...register('deliveryNote')}
                    />
                    <p className='text-red-500'>{errors.deliveryNote?.message}</p>
                </div>

                <Button type='submit' variant='default'>
                    Create Order
                </Button>
            </form>
        </BaseLayout>
    )
}

export default CreateOrderPage
