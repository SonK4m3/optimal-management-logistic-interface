/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@/components/layout/BaseLayout'
import { Button } from '@/components/ui/button'
import { Depot, Customer, Vehicle, Location, MarkerType } from '@/types/vrp'
import { useState } from 'react'
import VRPMap from './VRPMap'
import { generateVehicleColor } from '@/lib/color'
import TooltipIcon from '@/components/TooltipIcon'
import RequestFactory from '@/services/RequestFactory'
import { VRPRequestPayload } from '@/types/request'
import { VRPResultResponse } from '@/types/response'

const VRPPage: React.FC = () => {
    const request = RequestFactory.getRequest('VRPRequest')

    const [depots, setDepots] = useState<Depot[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [activeMarkerType, setActiveMarkerType] = useState<MarkerType>(null)
    const [id, setId] = useState<number>(1)
    const [result, setResult] = useState<VRPResultResponse | null>(null)

    const handleAddLocation = (location: Location, type: MarkerType) => {
        if (type === 'depot') {
            setDepots([
                ...depots,
                {
                    id: depots.length + 1,
                    location
                }
            ])
        } else if (type === 'customer') {
            setCustomers([
                ...customers,
                {
                    id: customers.length + 1,
                    location,
                    demand: (customers.length + 1) * 3
                }
            ])
        }
        setActiveMarkerType(null)
    }

    const handleSolveVRP = async () => {
        const vrp: VRPRequestPayload = { depots, customers, vehicles }
        console.log(vrp)

        const result = await request.solve(vrp)
        setResult(result.data)
    }

    const handleRefresh = () => {
        setDepots([])
        setCustomers([])
        setVehicles([])
        setResult(null)
        setId(1)
    }

    return (
        <BaseLayout title='VRP' titleTab='OML | VRP'>
            <div className='flex gap-4'>
                <Button
                    variant={activeMarkerType === 'depot' ? 'successGhost' : 'outline'}
                    onClick={() => setActiveMarkerType('depot')}
                >
                    Add depot
                </Button>
                <Button
                    variant={activeMarkerType === 'customer' ? 'successGhost' : 'outline'}
                    onClick={() => setActiveMarkerType('customer')}
                >
                    Add customer
                </Button>
                <Button
                    variant='accentGhost'
                    onClick={() =>
                        setVehicles([
                            ...vehicles,
                            {
                                id: vehicles.length + 1,
                                capacity: (vehicles.length + 1) * 10,
                                depot: undefined,
                                customerList: undefined,
                                totalDistanceMeters: 0,
                                remainingCapacity: 100
                            }
                        ])
                    }
                >
                    Add vehicle
                </Button>
                <div className='flex-1'></div>
                <Button variant='successSolid' onClick={handleSolveVRP}>
                    Solve VRP
                </Button>
                <Button variant='accentSolid' onClick={handleRefresh}>
                    Refresh
                </Button>
            </div>
            <div className='flex gap-4 h-4'>
                {activeMarkerType !== null ? 'Choose a location for ' + activeMarkerType : ''}
            </div>
            <div className='flex gap-4'>
                <div className='w-full flex flex-col gap-4'>
                    <div className='overflow-x-auto'>
                        <div className='text-sm font-semibold mb-2'>Depots</div>
                        <div className='flex gap-4 h-12'>
                            {depots.map((depot, index) => (
                                <div key={depot.id}>
                                    <TooltipIcon
                                        trigger={
                                            <div className='p-2 border rounded w-auto text-nowrap cursor-pointer'>
                                                {index + 1}
                                            </div>
                                        }
                                        content={`Depot (${depot.location.x}, ${depot.location.y})`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='overflow-x-auto'>
                        <div className='text-sm font-semibold mb-2'>Customers</div>
                        <div className='flex gap-4 h-12'>
                            {customers.map((customer, index) => (
                                <div key={customer.id}>
                                    <TooltipIcon
                                        trigger={
                                            <div className='p-2 border rounded w-auto text-nowrap cursor-pointer'>
                                                {index + 1}
                                            </div>
                                        }
                                        content={`Customer (${customer.location.x}, ${customer.location.y})`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='overflow-x-auto'>
                        <div className='text-sm font-semibold mb-2'>Vehicles</div>
                        <div className='flex gap-4 h-12'>
                            {vehicles.map((vehicle, index) => (
                                <div key={vehicle.id}>
                                    <TooltipIcon
                                        trigger={
                                            <div className='p-2 border rounded w-auto text-nowrap cursor-pointer'>
                                                {index + 1}
                                            </div>
                                        }
                                        content={`Vehicle (${vehicle.capacity})`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='w-full mt-4'>
                        <h3 className='text-lg font-semibold'>Routes</h3>
                        {result?.vehicleList.map((vehicle, index) => (
                            <div
                                key={vehicle.id}
                                className='p-2 border rounded mt-2'
                                style={{ borderColor: generateVehicleColor(index) }}
                            >
                                <p>
                                    Vehicle {vehicle.id} - Capacity: {vehicle.capacity} - Remaining
                                    Capacity: {vehicle.remainingCapacity} - Total Distance:{' '}
                                    {vehicle.totalDistanceMeters}
                                </p>
                                <div className='flex gap-2'>
                                    {vehicle.customerList
                                        ?.filter(
                                            c =>
                                                !vehicles.some(v =>
                                                    v.customerList?.some(vc => vc.id === c.id)
                                                )
                                        )
                                        .map(customer => (
                                            <div
                                                key={customer.id}
                                                className='px-2 py-1 text-sm rounded border border-gray-300'
                                            >
                                                {customer.id}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <VRPMap
                    depots={depots}
                    customers={customers}
                    vehicles={result?.vehicleList || []}
                    activeMarkerType={activeMarkerType}
                    onLocationAdd={handleAddLocation}
                    id={id}
                    updateId={setId}
                />
            </div>
        </BaseLayout>
    )
}

export default VRPPage
