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
import { toast } from '@/components/ui/use-toast'
import { orderSchema, OrderSchemaType } from '@/schemas/orderSchema'
import { X } from 'lucide-react'
import { PriorityType } from '@/types/order'
import FlexLabelValue from '@/components/FlexLabelValue'
import { Customer } from '@/types/resource'
import { useEffect, useMemo, useState } from 'react'
import { useModalContext } from '@/contexts/ModalContext'
import CreateAddressModal from './CreateAddressModal'
import { Product } from '@/types/product'
import AppSearchDropdown from '@/components/AppSearchDropdown'
import ColLabelValue from '@/components/ColLabelValue'

const SURCHARGE_FEE = {
    STANDARD: 0,
    EXPRESS: 50000,
    SPECIAL: 100000
}

const CreateOrderPage: React.FC = () => {
    const { user, accessToken } = useSelector((state: RootState) => state.user)
    const OrderRequest = RequestFactory.getRequest('OrderRequest')
    const ResourceRequest = RequestFactory.getRequest('ResourceRequest')
    const ProductRequest = RequestFactory.getRequest('ProductRequest')
    const { openModal } = useModalContext()

    const [customer, setCustomer] = useState<Customer | null>(null)
    const [products, setProducts] = useState<Product[]>([])

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
            items: [],
            priority: 'MEDIUM',
            deliveryNote: '',
            customerLocationId: 0,
            deliveryServiceType: 'STANDARD'
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items'
    })

    const totalWeight = useMemo(() => {
        return fields.reduce(
            (acc, item) =>
                acc + item.weight * (watch(`items.${fields.indexOf(item)}.quantity`) || 0),
            0
        )
    }, [fields, watch])

    const totalPrice = useMemo(() => {
        return fields.reduce(
            (acc, item) =>
                acc + item.price * (watch(`items.${fields.indexOf(item)}.quantity`) || 0),
            0
        )
    }, [fields, watch])

    const handleAddItem = (productId: number) => {
        const product = products.find(p => p.id === productId)
        if (!product) return

        if (fields.some(item => item.productId === productId)) return

        append({
            productId,
            quantity: 1,
            price: product.price,
            weight: product.weight
        })
    }

    const onSubmit = async (data: OrderSchemaType) => {
        const payload: OrderRequestPayload = {
            customerId: customer?.id || 0,
            items: data.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            })),
            priority: data.priority as PriorityType,
            deliveryNote: data.deliveryNote || undefined,
            customerLocationId: data.customerLocationId,
            deliveryServiceType: data.deliveryServiceType
        }

        try {
            const response = await OrderRequest.createOrderWithFee(payload)
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

    const fetchCustomer = async () => {
        setCustomer(null)
        try {
            const response = await ResourceRequest.getCustomerById(user?.id || 0)
            if (response.success) {
                setCustomer(response.data)
                if (response.data.addresses.length > 0) {
                    setValue('customerLocationId', response.data.addresses[0].id)
                }
            }
        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: `${(error as Error).message}`
            })
            setCustomer(null)
        }
    }

    const onClickNewAddress = () => {
        openModal({
            title: 'Create Address',
            content: (
                <CreateAddressModal
                    customerId={customer?.id || 0}
                    onSuccess={() => {
                        fetchCustomer()
                    }}
                />
            )
        })
    }

    const fetchProducts = async () => {
        const response = await ProductRequest.getProducts({
            query: '',
            page: 1,
            size: 100
        })
        if (response.success) {
            setProducts(response.data.docs)
        }
    }

    useEffect(() => {
        if (accessToken) {
            fetchCustomer()
            fetchProducts()
        }
    }, [accessToken])

    return (
        <BaseLayout title='Create Order' titleTab='OML | Create Order'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='space-y-6 max-w-2xl w-full mx-auto p-6'
            >
                <Button type='submit' variant='default'>
                    Create Order
                </Button>

                <div className='space-y-4 flex flex-col gap-4 border p-4 rounded-lg bg-gray-900 border-color-neutral-alpha-300'>
                    <FlexLabelValue label='Customer' value={customer?.fullName} />
                    <FlexLabelValue label='Phone' value={customer?.phone} />
                    <FlexLabelValue label='Email' value={customer?.email} />
                    <FlexLabelValue
                        label='Address'
                        value={
                            <div className='w-full flex items-center gap-2'>
                                <FormSelect
                                    selected={watch('customerLocationId').toString()}
                                    options={
                                        customer?.addresses.map(address => ({
                                            label: address.location.address,
                                            value: address.id.toString()
                                        })) || []
                                    }
                                    onSelect={value => {
                                        const address = customer?.addresses.find(
                                            address => address.id.toString() === value
                                        )
                                        setValue('customerLocationId', address?.id || 0)
                                    }}
                                />
                                <Button
                                    variant='primary'
                                    type='button'
                                    size='sm'
                                    onClick={onClickNewAddress}
                                >
                                    New Address
                                </Button>
                            </div>
                        }
                    />
                </div>

                {/* Products Section */}
                <div className='space-y-4'>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-semibold'>Products</h2>
                        <AppSearchDropdown
                            items={products.map(product => ({
                                label: product.name,
                                value: product.id
                            }))}
                            onSelect={value => handleAddItem(Number(value))}
                            placeholder='Search product...'
                        />
                    </div>
                    <div className='space-y-4 border p-4 rounded-lg bg-gray-900 border-color-neutral-alpha-300'>
                        {fields.map((field, index) => (
                            <div key={field.id} className='space-y-4 p-4 border rounded relative'>
                                <div className='grid grid-cols-4 gap-6'>
                                    <div className='space-y-2'>
                                        <ColLabelValue
                                            label='Product'
                                            value={
                                                products.find(p => p.id === field.productId)?.name
                                            }
                                        />
                                    </div>

                                    <div className='space-y-2'>
                                        <ColLabelValue
                                            label='Price'
                                            value={field.price.toLocaleString()}
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <ColLabelValue
                                            label='Weight'
                                            value={field.weight.toLocaleString()}
                                        />
                                    </div>

                                    <div className='space-y-2'>
                                        <label className='text-sm font-medium'>Quantity</label>
                                        <Input
                                            type='number'
                                            placeholder='Enter quantity'
                                            {...register(`items.${index}.quantity`, {
                                                valueAsNumber: true
                                            })}
                                            className={
                                                errors.items?.[index]?.quantity
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        />
                                        <p className='text-xs text-red-500'>
                                            {errors.items?.[index]?.quantity?.message}
                                        </p>
                                    </div>
                                </div>

                                {fields.length > 0 && (
                                    <Button
                                        type='button'
                                        variant='destructive'
                                        size='sm'
                                        className='absolute -top-3 -right-3 rounded-full'
                                        onClick={() => remove(index)}
                                    >
                                        <X className='w-4 h-4' />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Section */}
                <div className='space-y-4'>
                    <div className='flex justify-between items-center'>
                        <span className='font-medium'>Total Products:</span>
                        <span>{fields.length}</span>
                    </div>

                    <div className='flex justify-between items-center'>
                        <span className='font-medium'>Total Weight:</span>
                        <span>{totalWeight.toLocaleString()} gram</span>
                    </div>

                    <div className='flex justify-between items-center'>
                        <span className='font-medium'>Total Price:</span>
                        <span>{totalPrice.toLocaleString()} VND</span>
                    </div>
                </div>

                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Priority</h2>
                    <FormSelect
                        selected={watch('priority')}
                        options={['HIGH', 'MEDIUM', 'LOW'].map(priority => ({
                            label: priority,
                            value: priority
                        }))}
                        onSelect={value => setValue('priority', value as PriorityType)}
                    />
                    <p className='text-red-500'>{errors.priority?.message}</p>
                </div>

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

                <ColLabelValue
                    label='Delivery Service Type'
                    value={
                        <FormSelect
                            selected={watch('deliveryServiceType')}
                            options={['STANDARD', 'EXPRESS', 'SPECIAL'].map(type => ({
                                label: type,
                                value: type
                            }))}
                            onSelect={value =>
                                setValue(
                                    'deliveryServiceType',
                                    value as 'STANDARD' | 'EXPRESS' | 'SPECIAL'
                                )
                            }
                        />
                    }
                />

                <FlexLabelValue
                    label='Fee'
                    value={SURCHARGE_FEE[watch('deliveryServiceType')].toLocaleString() + ' VND'}
                />

                <FlexLabelValue
                    label='Total'
                    value={
                        (
                            totalPrice + SURCHARGE_FEE[watch('deliveryServiceType')]
                        ).toLocaleString() + ' VND'
                    }
                />

                <Button type='submit' variant='default'>
                    Create Order
                </Button>
            </form>
        </BaseLayout>
    )
}

export default CreateOrderPage
