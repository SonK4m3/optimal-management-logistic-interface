import { CheckWarehouseSpace, StorageArea, StorageLocation, Warehouse } from '@/types/warehouse'
import RequestFactory from '@/services/RequestFactory'
import { useCallback, useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import AppTable, { ColumnDef } from '@/components/AppTable'
import { useParams } from 'react-router-dom'
import BaseLayout from '@/components/layout/BaseLayout'
import { Button } from '@/components/ui/button'
import { useModalContext } from '@/contexts/ModalContext'
import CreateStorageLocationModal from './CreateStorageLocationModal'
import { StorageLocationFormData } from '@/schemas/storageLocation.schema'
import { StorageLocationRequestPayload } from '@/types/request'
import CreateStorageAreaModal, { StorageAreaFormData } from './CreateStorageAreaModal'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import FlexLabelValue from '@/components/FlexLabelValue'
const columns: ColumnDef<StorageLocation>[] = [
    {
        header: 'Code',
        accessorKey: 'code'
    },
    {
        header: 'Type',
        accessorKey: 'type'
    },
    {
        header: 'Storage Area',
        accessorKey: 'storageArea.name'
    },
    {
        header: 'Length',
        accessorKey: 'length'
    },
    {
        header: 'Width',
        accessorKey: 'width'
    },
    {
        header: 'Height',
        accessorKey: 'height'
    },
    {
        header: 'Max Weight',
        accessorKey: 'maxWeight'
    },
    {
        header: 'Is Occupied',
        accessorKey: 'isOccupied',
        action: item => <div>{item.isOccupied ? 'Yes' : 'No'}</div>
    },
    {
        header: 'Level',
        accessorKey: 'level'
    },
    {
        header: 'Position',
        accessorKey: 'position'
    }
]

const StorageLocationPage = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const { warehouseId } = useParams()
    const request = RequestFactory.getRequest('WarehouseRequest')
    const storageAreaRequest = RequestFactory.getRequest('StorageAreaRequest')
    const { openModal, closeModal } = useModalContext()

    const [warehouse, setWarehouse] = useState<Warehouse | null>(null)
    const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([])
    const [storageAreas, setStorageAreas] = useState<StorageArea[]>([])
    const [checkWarehouseSpace, setCheckWarehouseSpace] = useState<CheckWarehouseSpace | null>(null)

    const storageAreaColumns: ColumnDef<StorageArea>[] = [
        {
            header: 'Name',
            accessorKey: 'name'
        },
        {
            header: 'Area (m2)',
            accessorKey: 'area'
        },
        {
            header: 'Action',
            accessorKey: 'action',
            action: item => (
                <div>
                    <Button
                        variant='accentGhost'
                        type='button'
                        onClick={() => handleAddStorageLocation(item)}
                    >
                        Add location
                    </Button>
                </div>
            )
        }
    ]

    const fetchWarehouse = useCallback(async () => {
        if (!warehouseId) return

        if (!accessToken) return

        try {
            const response = await request.getWarehouseById(warehouseId)
            setWarehouse(response.data)
        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to fetch warehouse: ${(error as Error).message}`,
                variant: 'destructive'
            })
        }
    }, [request, warehouseId, accessToken])

    const fetchStorageLocations = useCallback(async () => {
        if (!warehouseId) return

        if (!accessToken) return

        setStorageLocations([])

        try {
            const response = await request.getStorageLocationsByWarehouse(warehouseId)
            setStorageLocations(response.data)
        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to fetch storage locations: ${(error as Error).message}`,
                variant: 'destructive'
            })
            setStorageLocations([])
        }
    }, [request, warehouseId, accessToken])

    const fetchStorageAreas = useCallback(async () => {
        if (!warehouseId) return

        if (!accessToken) return

        setStorageAreas([])

        try {
            const response = await storageAreaRequest.getStorageAreasByWarehouse(warehouseId)
            setStorageAreas(response.data)
        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to fetch storage areas: ${(error as Error).message}`,
                variant: 'destructive'
            })
            setStorageAreas([])
        }
    }, [storageAreaRequest, warehouseId, accessToken])

    const handleSubmit = async (data: StorageLocationFormData) => {
        if (!warehouseId) return

        const payload: StorageLocationRequestPayload = {
            storageAreaId: Number(data.storageAreaId),
            type: data.type,
            length: data.length,
            width: data.width,
            height: data.height,
            maxWeight: data.maxWeight,
            level: data.level,
            position: data.position
        }
        try {
            await request.createStorageLocation(payload)
            toast({
                title: 'Success',
                description: 'Storage location created successfully',
                variant: 'success'
            })
            closeModal()
        } catch (error) {
            toast({
                title: 'Error',
                description: `That storage location has the same level and position`,
                variant: 'destructive'
            })
        } finally {
            fetchStorageLocations()
        }
    }

    const handleAddStorageAreaSubmit = async (data: StorageAreaFormData) => {
        if (!warehouseId) return

        if (checkWarehouseSpace?.availableArea && checkWarehouseSpace.availableArea < data.area) {
            toast({
                title: 'Error',
                description: 'Not enough space in the warehouse',
                variant: 'destructive'
            })
            return
        }

        try {
            await storageAreaRequest.createStorageArea({
                warehouseId: Number(warehouseId),
                name: data.name,
                type: data.type,
                area: data.area
            })
            toast({
                title: 'Success',
                description: 'Storage area created successfully',
                variant: 'success'
            })
            closeModal()
        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to create storage area: ${(error as Error).message}`,
                variant: 'destructive'
            })
        } finally {
            fetchStorageAreas()
        }
    }

    const handleAddStorageLocation = (storageArea: StorageArea) => {
        if (!warehouseId) return

        openModal({
            title: 'Create Storage Location',
            content: (
                <CreateStorageLocationModal
                    warehouseId={warehouseId}
                    storageAreaId={storageArea.id.toString()}
                    onSubmit={handleSubmit}
                />
            )
        })
    }

    const handleAddStorageArea = () => {
        if (!warehouse) return

        openModal({
            title: 'Create Storage Area',
            content: (
                <CreateStorageAreaModal
                    warehouse={warehouse}
                    onSubmit={handleAddStorageAreaSubmit}
                />
            )
        })
    }

    const handleCheckWarehouseSpace = async () => {
        if (!warehouseId) return

        try {
            const response = await request.checkWarehouseSpace(warehouseId)
            setCheckWarehouseSpace(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchWarehouse()
        fetchStorageLocations()
        fetchStorageAreas()
        handleCheckWarehouseSpace()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <BaseLayout title={warehouse?.name || 'Storage Locations'}>
            <div className='grid grid-cols-2 gap-4'>
                <FlexLabelValue
                    label='Total Capacity (m3)'
                    value={checkWarehouseSpace?.totalCapacity}
                />
                <FlexLabelValue label='Total Area (m2)' value={checkWarehouseSpace?.totalArea} />
                <FlexLabelValue
                    label='Available Capacity (m3)'
                    value={checkWarehouseSpace?.availableCapacity}
                />
                <FlexLabelValue
                    label='Available Area (m2)'
                    value={checkWarehouseSpace?.availableArea}
                />
            </div>
            <div className='flex gap-2'>
                <Button variant='primary' type='button' onClick={handleAddStorageArea}>
                    Add Storage Area
                </Button>
            </div>
            <AppTable data={storageAreas} headers={storageAreaColumns} />
            <AppTable data={storageLocations} headers={columns} />
        </BaseLayout>
    )
}

export default StorageLocationPage
