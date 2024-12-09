import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { FormError } from '@/components/ui/form-error'
import { Warehouse } from '@/types/warehouse'
import RequestFactory from '@/services/RequestFactory'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Product } from '@/types/product'
import AppSearchDropdown from '@/components/AppSearchDropdown'
import { useModalContext } from '@/contexts/ModalContext'
import CreateProductForm from './CreateProductForm'
import ColLabelValue from '@/components/ColLabelValue'
import { toast } from '@/components/ui/use-toast'
import { z } from 'zod'
import { Inventory } from '@/types/inventory'
import { Controller } from 'react-hook-form'
import DateTimePicker from '@/components/DateTimePicker'

interface CreateShipmentFormProps {
    warehouse: Warehouse
    id: string
    onSuccess?: () => void
}

const createShipmentSchema = z.object({
    shipmentDate: z.string(),
    notes: z.string(),
    details: z.array(
        z.object({
            productId: z.number(),
            quantity: z.number().min(1),
            note: z.string()
        })
    )
})

type CreateShipmentSchema = z.infer<typeof createShipmentSchema>

const CreateShipmentForm: React.FC<CreateShipmentFormProps> = ({ warehouse, id, onSuccess }) => {
    const request = RequestFactory.getRequest('ShipmentRequest')
    const inventoryRequest = RequestFactory.getRequest('InventoryRequest')
    const { openModal, closeModal } = useModalContext()

    const [inventory, setInventory] = useState<Inventory[]>([])

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<CreateShipmentSchema>({
        resolver: zodResolver(createShipmentSchema),
        defaultValues: {
            shipmentDate: moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            details: [],
            notes: ''
        },
        mode: 'onSubmit'
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'details'
    })

    const onSubmit = async (data: CreateShipmentSchema) => {
        if (fields.length === 0) {
            toast({
                title: 'Error',
                description: 'Please add at least one item',
                variant: 'destructive'
            })
            return
        }

        const shipmentDetails = data.details.map(detail => ({
            productId: detail.productId,
            quantity: detail.quantity,
            note: detail.note
        }))

        for (const detail of shipmentDetails) {
            const inventoryItem = inventory.find(p => p.product.id === detail.productId)
            if (
                !inventoryItem ||
                inventoryItem.quantity < detail.quantity ||
                inventoryItem.quantity < 1
            ) {
                toast({
                    title: 'Error',
                    description: 'Insufficient quantity',
                    variant: 'destructive'
                })
                return
            }
        }

        try {
            const res = await request.createShipment({
                warehouseId: warehouse.id,
                shipmentDate: data.shipmentDate,
                notes: data.notes,
                details: shipmentDetails
            })
            if (res) {
                toast({
                    title: 'Success',
                    description: 'Shipment created successfully',
                    variant: 'success'
                })
                onSuccess?.()
            }
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error',
                description: 'Failed to create shipment',
                variant: 'destructive'
            })
        }
    }

    const fetchInventory = async () => {
        if (!warehouse.id) return

        const response = await inventoryRequest.getInventoryByWarehouse(warehouse.id.toString())
        setInventory(response.data)
    }

    const handleAddItem = (product: Product) => {
        const existingProduct = fields.find(field => field.productId === product.id)

        if (!existingProduct) {
            append({
                productId: product.id,
                quantity: 1,
                note: ''
            })
        }
    }

    const handleCreateProductSuccess = (product: Product) => {
        handleAddItem(product)
        fetchInventory()
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

    useEffect(() => {
        fetchInventory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <label htmlFor='shipmentDate'>Shipment Date</label>
                    <Controller
                        name='shipmentDate'
                        control={control}
                        render={({ field }) => (
                            <DateTimePicker
                                value={new Date(field.value)}
                                onChange={time => {
                                    field.onChange(time?.toISOString())
                                }}
                            />
                        )}
                    />
                    {errors.shipmentDate && <FormError>{errors.shipmentDate.message}</FormError>}
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor='details'>Selected Items</label>
                    <div className='flex gap-2 items-center'>
                        <AppSearchDropdown
                            items={inventory.map(item => ({
                                label: item.product.name,
                                value: item.product.id
                            }))}
                            onSelect={value =>
                                handleAddItem(inventory.find(p => p.product.id === value)!.product)
                            }
                            placeholder='Search product...'
                        />
                        <Button variant='primary' type='button' onClick={handleNewProduct}>
                            More
                        </Button>
                    </div>
                    <div className='flex flex-col gap-2 border rounded-lg p-4 border-neutral-500'>
                        {fields.map((field, index) => (
                            <div key={field.id} className='flex gap-4 items-center'>
                                <ColLabelValue
                                    label='Available Quantity'
                                    value={
                                        inventory.find(p => p.product.id === field.productId)
                                            ?.quantity
                                    }
                                />
                                <ColLabelValue
                                    label='Product'
                                    value={
                                        inventory.find(p => p.product.id === field.productId)
                                            ?.product.name
                                    }
                                />
                                <ColLabelValue
                                    label='Quantity'
                                    value={
                                        <Input
                                            type='number'
                                            {...register(`details.${index}.quantity`, {
                                                valueAsNumber: true
                                            })}
                                            aria-label={`Quantity for ${inventory.find(p => p.product.id === field.productId)?.product.name}`}
                                        />
                                    }
                                />
                                <ColLabelValue
                                    label='Note'
                                    value={
                                        <Input
                                            {...register(`details.${index}.note`)}
                                            placeholder='Item note'
                                            aria-label={`Note for ${inventory.find(p => p.product.id === field.productId)?.product.name}`}
                                        />
                                    }
                                />
                                <Button
                                    type='button'
                                    variant='destructive'
                                    onClick={() => remove(index)}
                                    aria-label={`Remove ${inventory.find(p => p.product.id === field.productId)?.product.name}`}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        {errors.details && <FormError>{errors.details.message}</FormError>}
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor='notes'>Notes</label>
                    <Textarea
                        {...register('notes')}
                        aria-label='Shipment notes'
                        className='border-neutral-400'
                    />
                    {errors.notes && <FormError>{errors.notes.message}</FormError>}
                </div>

                <div className='flex justify-end'>
                    <Button variant='successSolid' type='submit' form={id}>
                        Create Shipment
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default CreateShipmentForm
