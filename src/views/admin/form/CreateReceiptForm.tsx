import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { FormError } from '@/components/ui/form-error'
import { createReceiptSchema, CreateReceiptSchema } from '@/schemas/receiptSchema'
import { StorageLocation, StorageLocationType, Warehouse } from '@/types/warehouse'
import RequestFactory from '@/services/RequestFactory'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { Product } from '@/types/product'
import AppSearchDropdown from '@/components/AppSearchDropdown'
import { useModalContext } from '@/contexts/ModalContext'
import CreateProductForm from './CreateProductForm'
import ColLabelValue from '@/components/ColLabelValue'
import debounce from 'debounce'
import { toast } from '@/components/ui/use-toast'
import FormSelect from '@/components/FormSelect'
import FlexLabelValue from '@/components/FlexLabelValue'

interface CreateReceiptFormProps {
    warehouse: Warehouse
    id: string
    onSuccess?: () => void
    type: 'INBOUND' | 'OUTBOUND'
    availableArea?: number
    availableCapacity?: number
}

const CreateReceiptForm: React.FC<CreateReceiptFormProps> = ({
    warehouse,
    id,
    onSuccess,
    type,
    availableArea,
    availableCapacity
}) => {
    const request = RequestFactory.getRequest('WarehouseRequest')
    const productRequest = RequestFactory.getRequest('ProductRequest')
    const { openModal, closeModal } = useModalContext()

    const [products, setProducts] = useState<Product[]>([])
    const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([])
    const [params, setParams] = useState<{
        warehouseId: number
        requiredWeight: number
        preferredType: StorageLocationType
        minLength: number
        minWidth: number
        minHeight: number
    }>({
        warehouseId: warehouse.id,
        requiredWeight: 0,
        preferredType: 'RACK',
        minLength: 0,
        minWidth: 0,
        minHeight: 0
    })

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors }
    } = useForm<CreateReceiptSchema>({
        resolver: zodResolver(createReceiptSchema),
        defaultValues: {
            items: [],
            storageLocationId: 0,
            notes: ''
        },
        mode: 'onSubmit'
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items'
    })

    const onSubmit = async (data: CreateReceiptSchema) => {
        if (fields.length === 0) {
            toast({
                title: 'Error',
                description: 'Please add at least one item',
                variant: 'destructive'
            })
            return
        }

        if (type === 'INBOUND' && availableArea && availableCapacity) {
            if (data.items.reduce((acc, item) => acc + item.quantity, 0) > availableCapacity) {
                toast({
                    title: 'Error',
                    description: 'Not enough area',
                    variant: 'destructive'
                })
                return
            }
        }

        try {
            const res = await request.createReceipt(warehouse.id.toString(), {
                ...data,
                type
            })
            if (res) {
                toast({
                    title: 'Success',
                    description: 'Receipt created successfully',
                    variant: 'success'
                })
                onSuccess?.()
            }
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error',
                description: 'Failed to create receipt',
                variant: 'destructive'
            })
        }
    }

    const fetchProducts = async (query: string) => {
        const response = await productRequest.getProducts({ query, page: 1, size: 100 })
        setProducts(response.data.docs)
    }

    const handleAddItem = (product: Product) => {
        const existingProduct = fields.find(field => field.productId === product.id)

        if (!existingProduct) {
            append({
                productId: product.id,
                quantity: 1,
                note: ''
            })

            setParams({
                ...params,
                requiredWeight: params.requiredWeight + product.weight
            })
        }
    }

    const handleRemoveItem = (index: number) => {
        setParams({
            ...params,
            requiredWeight:
                params.requiredWeight -
                fields[index].quantity *
                    products.find(p => p.id === fields[index].productId)!.weight
        })

        remove(index)
    }

    const handleCreateProductSuccess = (product: Product) => {
        handleAddItem(product)
        fetchProducts('')
        closeModal()
    }

    const handleNewProduct = async () => {
        openModal({
            title: 'Create Product',
            content: (
                <CreateProductForm onSuccess={handleCreateProductSuccess} length={fields.length} />
            )
        })
    }

    const fetchProductsDebounced = debounce((search: string) => {
        if (search) {
            fetchProducts(search)
        } else {
            fetchProducts('')
        }
    }, 500)

    const fetchStorageLocations = useCallback(async () => {
        setStorageLocations([])
        setValue('storageLocationId', 0)

        try {
            const response = await request.findAvailableStorageLocations({
                warehouseId: warehouse.id,
                requiredWeight: params.requiredWeight,
                preferredType: params.preferredType,
                minHeight: params.minHeight,
                minWidth: params.minWidth,
                minLength: params.minLength
            })
            setStorageLocations(response.data)
            if (response.data.length > 0) {
                setValue('storageLocationId', response.data[0].id)
            }
        } catch (error) {
            console.log(error)
            setStorageLocations([])
        }
    }, [
        params.minHeight,
        params.minLength,
        params.minWidth,
        params.preferredType,
        params.requiredWeight,
        request,
        setValue,
        warehouse.id
    ])

    useEffect(() => {
        fetchProducts('')
    }, [])

    return (
        <div className='flex flex-col gap-4'>
            <div className='text-sm text-muted-foreground'>
                Created Date: {moment().format('DD/MM/YYYY')}
                <br />
                Warehouse: {warehouse.name}
            </div>
            <form
                id={id}
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col gap-4'
                noValidate
            >
                <div className='flex flex-col gap-2'>
                    <label htmlFor='items'>Selected Items</label>
                    <div className='flex gap-2 items-center'>
                        <AppSearchDropdown
                            items={products.map(product => ({
                                label: product.name,
                                value: product.id
                            }))}
                            onSelect={value => handleAddItem(products.find(p => p.id === value)!)}
                            onInputChange={value => {
                                fetchProductsDebounced(value)
                            }}
                            placeholder='Search product...'
                        />
                        <Button variant='primary' type='button' onClick={handleNewProduct}>
                            More
                        </Button>
                    </div>
                    <div
                        role='region'
                        aria-label='Selected items list'
                        className='flex flex-col gap-2 border rounded-lg p-4 border-neutral-500'
                    >
                        {fields.map((field, index) => (
                            <div key={field.id} className='flex gap-4 items-center'>
                                <ColLabelValue
                                    label='Product'
                                    value={products.find(p => p.id === field.productId)?.name}
                                />
                                <ColLabelValue
                                    label='Quantity'
                                    value={
                                        <Input
                                            type='number'
                                            {...register(`items.${index}.quantity`, {
                                                valueAsNumber: true,
                                                onChange(event) {
                                                    // Calculate total weight of all items
                                                    const totalWeight = fields.reduce(
                                                        (sum, item, idx) => {
                                                            const quantity =
                                                                idx === index
                                                                    ? event.target.valueAsNumber
                                                                    : watch(
                                                                          `items.${idx}.quantity`
                                                                      ) || 0
                                                            const product = products.find(
                                                                p => p.id === item.productId
                                                            )
                                                            return (
                                                                sum +
                                                                quantity * (product?.weight || 0)
                                                            )
                                                        },
                                                        0
                                                    )

                                                    setParams({
                                                        ...params,
                                                        requiredWeight: totalWeight
                                                    })
                                                }
                                            })}
                                            aria-label={`Quantity for ${products.find(p => p.id === field.productId)?.name}`}
                                        />
                                    }
                                />
                                <ColLabelValue
                                    label='Note'
                                    value={
                                        <Input
                                            {...register(`items.${index}.note`)}
                                            placeholder='Item note'
                                            aria-label={`Note for ${products.find(p => p.id === field.productId)?.name}`}
                                        />
                                    }
                                />
                                <Button
                                    type='button'
                                    variant='destructive'
                                    onClick={() => handleRemoveItem(index)}
                                    aria-label={`Remove ${products.find(p => p.id === field.productId)?.name}`}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        {errors.items && <FormError>{errors.items.message}</FormError>}
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='notes'>Notes</label>
                    <Textarea
                        {...register('notes')}
                        aria-label='Receipt notes'
                        className='border-neutral-400'
                    />
                    {errors.notes && <FormError>{errors.notes.message}</FormError>}
                </div>
                <div className='flex flex-col gap-2'>
                    <div>
                        <div>Params</div>
                        <div className='grid grid-cols-2 gap-2'>
                            <FlexLabelValue label='Required Weight' value={params.requiredWeight} />
                            <FlexLabelValue
                                label='Preferred Type'
                                value={
                                    <FormSelect
                                        selected={params.preferredType}
                                        options={['RACK', 'SHELF', 'BIN', 'FLOOR', 'COLD_ROOM'].map(
                                            type => ({
                                                label: type,
                                                value: type
                                            })
                                        )}
                                        onSelect={value =>
                                            setParams({
                                                ...params,
                                                preferredType: value as StorageLocationType
                                            })
                                        }
                                    />
                                }
                            />
                            <FlexLabelValue
                                label='Min Length'
                                value={
                                    <Input
                                        type='number'
                                        value={params.minLength}
                                        onChange={e =>
                                            setParams({
                                                ...params,
                                                minLength: e.target.valueAsNumber
                                            })
                                        }
                                    />
                                }
                            />
                            <FlexLabelValue
                                label='Min Width'
                                value={
                                    <Input
                                        type='number'
                                        value={params.minWidth}
                                        onChange={e =>
                                            setParams({
                                                ...params,
                                                minWidth: e.target.valueAsNumber
                                            })
                                        }
                                    />
                                }
                            />
                            <FlexLabelValue
                                label='Min Height'
                                value={
                                    <Input
                                        type='number'
                                        value={params.minHeight}
                                        onChange={e =>
                                            setParams({
                                                ...params,
                                                minHeight: e.target.valueAsNumber
                                            })
                                        }
                                    />
                                }
                            />
                        </div>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <ColLabelValue
                            label='Storage Location'
                            value={
                                <FormSelect
                                    selected={
                                        storageLocations.find(
                                            l => l.id === watch('storageLocationId')
                                        )?.code
                                    }
                                    options={storageLocations.map(location => ({
                                        label: location.code,
                                        value: location.code
                                    }))}
                                    onSelect={value => {
                                        const selectedLocation = storageLocations.find(
                                            l => l.code === value
                                        )
                                        if (selectedLocation) {
                                            setValue('storageLocationId', selectedLocation.id)
                                        }
                                    }}
                                />
                            }
                        />
                        <Button variant='primary' type='button' onClick={fetchStorageLocations}>
                            Find
                        </Button>
                    </div>
                    <div className='grid grid-cols-2 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-200'>
                        {watch('storageLocationId') > 0 &&
                            (() => {
                                const selectedLocation = storageLocations.find(
                                    l => l.id === watch('storageLocationId')
                                )
                                return (
                                    <>
                                        <FlexLabelValue
                                            label='Warehouse'
                                            value={selectedLocation?.storageArea.warehouse.name}
                                        />
                                        <FlexLabelValue
                                            label='Storage Area'
                                            value={selectedLocation?.storageArea.name}
                                        />
                                        <FlexLabelValue
                                            label='Code'
                                            value={selectedLocation?.code}
                                        />
                                        <FlexLabelValue
                                            label='Type'
                                            value={
                                                <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'>
                                                    {selectedLocation?.type}
                                                </span>
                                            }
                                        />
                                        <FlexLabelValue
                                            label='Length'
                                            value={`${selectedLocation?.length} m`}
                                        />
                                        <FlexLabelValue
                                            label='Width'
                                            value={`${selectedLocation?.width} m`}
                                        />
                                        <FlexLabelValue
                                            label='Height'
                                            value={`${selectedLocation?.height} m`}
                                        />
                                        <FlexLabelValue
                                            label='Max Weight'
                                            value={`${selectedLocation?.maxWeight} gam`}
                                        />
                                    </>
                                )
                            })()}
                    </div>
                </div>
                <div className='flex justify-end'>
                    <Button variant='successSolid' type='submit' form={id}>
                        Create
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default CreateReceiptForm
