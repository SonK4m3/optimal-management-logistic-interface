import ColLabelValue from '@/components/ColLabelValue'
import FormSelect from '@/components/FormSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StorageLocationFormData, storageLocationSchema } from '@/schemas/storageLocation.schema'
import { StorageLocationType } from '@/types/warehouse'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface CreateStorageLocationModalProps {
    warehouseId: string
    storageAreaId: string
    onSubmit: (data: StorageLocationFormData) => void
}

const CreateStorageLocationModal = ({
    storageAreaId,
    onSubmit
}: CreateStorageLocationModalProps) => {
    const { register, handleSubmit, setValue, watch } = useForm<StorageLocationFormData>({
        resolver: zodResolver(storageLocationSchema),
        defaultValues: {
            storageAreaId: storageAreaId,
            type: 'RACK',
            length: 1,
            width: 1,
            height: 1,
            maxWeight: 1,
            level: 1,
            position: 1
        }
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <ColLabelValue
                label='Type'
                value={
                    <FormSelect
                        selected={watch('type')}
                        onSelect={value => {
                            setValue('type', value as StorageLocationType)
                        }}
                        options={['RACK', 'SHELF', 'BIN', 'FLOOR', 'COLD_ROOM'].map(type => ({
                            label: type,
                            value: type
                        }))}
                    />
                }
            />
            <ColLabelValue
                label='Length'
                value={<Input type='number' {...register('length', { valueAsNumber: true })} />}
            />
            <ColLabelValue
                label='Width'
                value={<Input type='number' {...register('width', { valueAsNumber: true })} />}
            />
            <ColLabelValue
                label='Height'
                value={<Input type='number' {...register('height', { valueAsNumber: true })} />}
            />
            <ColLabelValue
                label='Max Weight'
                value={<Input type='number' {...register('maxWeight', { valueAsNumber: true })} />}
            />
            <ColLabelValue
                label='Level'
                value={<Input type='number' {...register('level', { valueAsNumber: true })} />}
            />
            <ColLabelValue
                label='Position'
                value={<Input type='number' {...register('position', { valueAsNumber: true })} />}
            />
            <div className='flex justify-end'>
                <Button variant='successGhost' type='submit'>
                    Create
                </Button>
            </div>
        </form>
    )
}

export default CreateStorageLocationModal
