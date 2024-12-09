import ColLabelValue from '@/components/ColLabelValue'
import FlexLabelValue from '@/components/FlexLabelValue'
import FormSelect from '@/components/FormSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StorageAreaType, Warehouse } from '@/types/warehouse'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface CreateStorageAreaModalProps {
    warehouse: Warehouse
    onSubmit: (data: StorageAreaFormData) => void
}

const storageAreaSchema = z.object({
    warehouseId: z.string(),
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['RECEIVING', 'SHIPPING', 'STORAGE']),
    area: z.number().min(1, 'Area must be greater than 0')
})

export type StorageAreaFormData = z.infer<typeof storageAreaSchema>

const CreateStorageAreaModal = ({ warehouse, onSubmit }: CreateStorageAreaModalProps) => {
    const { register, handleSubmit, setValue, watch } = useForm<StorageAreaFormData>({
        resolver: zodResolver(storageAreaSchema),
        defaultValues: {
            warehouseId: warehouse.id.toString(),
            name: 'A',
            type: 'RECEIVING',
            area: 10
        }
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-4'>
                <FlexLabelValue label='Total Capacity (m3)' value={warehouse.totalCapacity} />
            </div>
            <ColLabelValue label='Name' value={<Input type='text' {...register('name')} />} />
            <ColLabelValue
                label='Type'
                value={
                    <FormSelect
                        selected={watch('type')}
                        onSelect={value => {
                            setValue('type', value as StorageAreaType)
                        }}
                        options={['RECEIVING', 'SHIPPING', 'STORAGE'].map(type => ({
                            label: type,
                            value: type
                        }))}
                    />
                }
            />
            <ColLabelValue
                label='Area (m2)'
                value={<Input type='number' {...register('area', { valueAsNumber: true })} />}
            />
            <div className='flex justify-end'>
                <Button variant='successGhost' type='submit'>
                    Create
                </Button>
            </div>
        </form>
    )
}

export default CreateStorageAreaModal
