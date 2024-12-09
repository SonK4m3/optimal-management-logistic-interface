import { Button } from '@/components/ui/button'
import { Category, Product, StorageCondition, Supplier } from '@/types/product'
import { Input } from '@/components/ui/input'
import { ProductFormValues, productSchema } from '@/schemas/productSchema'
import RequestFactory from '@/services/RequestFactory'
import { CreateProductBodyRequest } from '@/types/request'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/components/ui/use-toast'
import { useModalContext } from '@/contexts/ModalContext'
import { STORAGE_CONDITION } from '@/constant/enum'
import FormSelect from '@/components/FormSelect'
import { useCallback, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import CreateSupplierForm from './CreateSupplierForm'
import CreateCategoryForm from './CreateCategoryForm'

const CreateProductForm = ({
    onSuccess,
    length
}: {
    onSuccess: (product: Product) => void
    length: number
}) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const productRequest = RequestFactory.getRequest('ProductRequest')
    const { openModal } = useModalContext()

    const [categories, setCategories] = useState<Category[]>([])
    const [suppliers, setSuppliers] = useState<Supplier[]>([])

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: `Product ${length + 1}`,
            unit: 'kg',
            price: 120000,
            weight: 1,
            dimensions: '10x10x10',
            minStockLevel: 10,
            maxStockLevel: 100,
            reorderPoint: 20,
            storageCondition: 'NORMAL',
            imageUrl: '',
            categoryId: 0,
            supplierId: 0
        }
    })

    const onSubmit = async (data: ProductFormValues) => {
        const payload: CreateProductBodyRequest = {
            name: data.name,
            imageUrl: data.imageUrl,
            categoryId: data.categoryId,
            supplierId: data.supplierId,
            price: data.price,
            unit: data.unit,
            storageCondition: data.storageCondition as StorageCondition,
            weight: data.weight,
            dimensions: data.dimensions,
            minStockLevel: data.minStockLevel,
            maxStockLevel: data.maxStockLevel,
            reorderPoint: data.reorderPoint
        }

        try {
            const response = await productRequest.createProduct(payload)
            onSuccess(response.data)
            toast({
                variant: 'success',
                title: 'Product created successfully',
                description: 'The product has been created successfully'
            })
        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                title: 'Failed to create product',
                description: 'An error occurred while creating the product'
            })
        }
    }

    const getCategories = useCallback(async () => {
        if (!accessToken) return

        const response = await productRequest.getCategories({
            page: 1,
            size: 10
        })
        setCategories(response.data.docs)
        if (response.data.docs.length > 0) {
            setValue('categoryId', response.data.docs[0].id)
        }
    }, [accessToken, productRequest, setValue])

    const getSuppliers = useCallback(async () => {
        if (!accessToken) return

        const response = await productRequest.getSuppliers({
            page: 1,
            size: 10
        })
        setSuppliers(response.data.docs)
        if (response.data.docs.length > 0) {
            setValue('supplierId', response.data.docs[0].id)
        }
    }, [accessToken, productRequest, setValue])

    useEffect(() => {
        getCategories()
        getSuppliers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div className='grid grid-cols-2 gap-2'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='name'>Name</label>
                    <Input type='text' {...register('name')} placeholder='Name' />
                    {errors.name && (
                        <p className='text-sm text-destructive'>{errors.name.message}</p>
                    )}
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='unit'>Unit</label>
                    <Input type='text' {...register('unit')} placeholder='Unit' />
                    {errors.unit && (
                        <p className='text-sm text-destructive'>{errors.unit.message}</p>
                    )}
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='price'>Price</label>
                    <Input
                        type='number'
                        {...register('price', { valueAsNumber: true })}
                        placeholder='Price'
                    />
                    {errors.price && (
                        <p className='text-sm text-destructive'>{errors.price.message}</p>
                    )}
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='weight'>Weight</label>
                    <Input
                        type='number'
                        {...register('weight', { valueAsNumber: true })}
                        placeholder='Weight'
                    />
                    {errors.weight && (
                        <p className='text-sm text-destructive'>{errors.weight.message}</p>
                    )}
                </div>
            </div>
            <div className='grid grid-cols-2 gap-2'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='dimensions'>Dimensions</label>
                    <Input type='text' {...register('dimensions')} placeholder='Dimensions' />
                    {errors.dimensions && (
                        <p className='text-sm text-destructive'>{errors.dimensions.message}</p>
                    )}
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='minStockLevel'>Min Stock Level</label>
                    <Input
                        type='number'
                        {...register('minStockLevel', { valueAsNumber: true })}
                        placeholder='Min Stock Level'
                    />
                    {errors.minStockLevel && (
                        <p className='text-sm text-destructive'>{errors.minStockLevel.message}</p>
                    )}
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='maxStockLevel'>Max Stock Level</label>
                    <Input
                        type='number'
                        {...register('maxStockLevel', { valueAsNumber: true })}
                        placeholder='Max Stock Level'
                    />
                    {errors.maxStockLevel && (
                        <p className='text-sm text-destructive'>{errors.maxStockLevel.message}</p>
                    )}
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='reorderPoint'>Reorder Point</label>
                    <Input
                        type='number'
                        {...register('reorderPoint', { valueAsNumber: true })}
                        placeholder='Reorder Point'
                    />
                    {errors.reorderPoint && (
                        <p className='text-sm text-destructive'>{errors.reorderPoint.message}</p>
                    )}
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='storageCondition'>Storage Condition</label>
                    <FormSelect<string>
                        selected={watch('storageCondition')}
                        options={Object.values(STORAGE_CONDITION).map(condition => ({
                            label: condition,
                            value: condition
                        }))}
                        onSelect={value => setValue('storageCondition', value as StorageCondition)}
                    />
                </div>
            </div>
            <div className='grid grid-cols-2 gap-2'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='categoryId'>Category</label>
                    <FormSelect<string>
                        selected={categories.find(c => c.id === watch('categoryId'))?.name}
                        options={categories.map(c => ({
                            label: c.name,
                            value: c.name
                        }))}
                        onSelect={value =>
                            setValue('categoryId', categories.find(c => c.name === value)?.id ?? 0)
                        }
                    />
                    {errors.categoryId && (
                        <p className='text-sm text-destructive'>{errors.categoryId.message}</p>
                    )}
                    <Button
                        variant='default'
                        type='button'
                        onClick={() =>
                            openModal({
                                title: 'Create Category',
                                content: <CreateCategoryForm onSuccess={getCategories} />
                            })
                        }
                    >
                        Create Category
                    </Button>
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='supplierId'>Supplier</label>
                    <FormSelect<string>
                        selected={suppliers.find(s => s.id === watch('supplierId'))?.name}
                        options={suppliers.map(s => ({
                            label: s.name,
                            value: s.name
                        }))}
                        onSelect={value =>
                            setValue('supplierId', suppliers.find(s => s.name === value)?.id ?? 0)
                        }
                    />
                    {errors.supplierId && (
                        <p className='text-sm text-destructive'>{errors.supplierId.message}</p>
                    )}
                    <Button
                        variant='default'
                        type='button'
                        onClick={() =>
                            openModal({
                                title: 'Create Supplier',
                                content: <CreateSupplierForm onSuccess={getSuppliers} />
                            })
                        }
                    >
                        Create Supplier
                    </Button>
                </div>
            </div>
            <div className='flex justify-end'>
                <Button variant='successSolid' type='submit'>
                    Create
                </Button>
            </div>
        </form>
    )
}

export default CreateProductForm
