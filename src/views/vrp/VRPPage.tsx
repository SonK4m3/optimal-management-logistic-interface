/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@/components/layout/BaseLayout'
import { Button } from '@/components/ui/button'
import { Depot, Customer, Vehicle, Location } from '@/types/vrp'
import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
})

type MarkerType = 'depot' | 'customer' | null

const generateVehicleColor = (index: number): string => {
    const colors = [
        '#FF5733', // Orange-red
        '#33FF57', // Lime green
        '#3357FF', // Blue
        '#FF33F6', // Pink
        '#33FFF6', // Cyan
        '#F6FF33' // Yellow
    ]
    return colors[index % colors.length]
}

const VRPPage: React.FC = () => {
    const [depots, setDepots] = useState<Depot[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [activeMarkerType, setActiveMarkerType] = useState<MarkerType>(null)

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
                    demand: 100
                }
            ])
        }
        setActiveMarkerType(null)
    }

    const handleAssignCustomerToVehicle = (vehicleId: number, customerId: number) => {
        setVehicles(prevVehicles => {
            return prevVehicles.map(vehicle => {
                if (vehicle.id === vehicleId) {
                    const customer = customers.find(c => c.id === customerId)
                    if (customer) {
                        return {
                            ...vehicle,
                            customerList: [...(vehicle.customerList || []), customer]
                        }
                    }
                }
                return vehicle
            })
        })
    }

    const handleSolveVRP = () => {
        console.log('Solve VRP')
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
                                capacity: 100,
                                depot: depots[0],
                                customerList: customers,
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
            </div>
            <div className='flex gap-4'>
                {activeMarkerType !== null ? 'Choose a location for ' + activeMarkerType : ''}
            </div>
            <Map
                depots={depots}
                customers={customers}
                vehicles={vehicles}
                activeMarkerType={activeMarkerType}
                onLocationAdd={handleAddLocation}
            />

            <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Vehicles and Routes</h3>
                {vehicles.map((vehicle, index) => (
                    <div
                        key={vehicle.id}
                        className='p-2 border rounded mt-2'
                        style={{ borderColor: generateVehicleColor(index) }}
                    >
                        <p>
                            Vehicle {vehicle.id} - Capacity: {vehicle.remainingCapacity}
                        </p>
                        <div className='flex gap-2'>
                            {customers
                                .filter(
                                    c =>
                                        !vehicles.some(v =>
                                            v.customerList?.some(vc => vc.id === c.id)
                                        )
                                )
                                .map(customer => (
                                    <button
                                        key={customer.id}
                                        className='px-2 py-1 text-sm bg-gray-100 rounded'
                                        onClick={() =>
                                            handleAssignCustomerToVehicle(vehicle.id, customer.id)
                                        }
                                    >
                                        Add Customer {customer.id}
                                    </button>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </BaseLayout>
    )
}

interface MapProps {
    depots: Depot[]
    customers: Customer[]
    vehicles: Vehicle[]
    activeMarkerType: MarkerType
    onLocationAdd: (location: Location, type: MarkerType) => void
}

const Map: React.FC<MapProps> = ({
    depots,
    customers,
    vehicles,
    activeMarkerType,
    onLocationAdd
}) => {
    const MapEvents = () => {
        useMapEvents({
            click: e => {
                if (activeMarkerType) {
                    const newLocation: Location = {
                        id: Date.now(),
                        x: e.latlng.lat,
                        y: e.latlng.lng
                    }
                    onLocationAdd(newLocation, activeMarkerType)
                }
            }
        })
        return null
    }

    const renderVehicleRoutes = () => {
        return vehicles.map((vehicle, index) => {
            if (!vehicle.depot || !vehicle.customerList?.length) return null

            // Create an array of positions starting with the depot
            const positions: [number, number][] = [
                [vehicle.depot.location.x, vehicle.depot.location.y]
            ]

            // Add customer positions in order
            vehicle.customerList.forEach(customer => {
                positions.push([customer.location.x, customer.location.y])
            })

            // Complete the route by returning to depot
            positions.push([vehicle.depot.location.x, vehicle.depot.location.y])

            return (
                <Polyline
                    key={vehicle.id}
                    positions={positions}
                    pathOptions={{
                        color: generateVehicleColor(index),
                        weight: 3,
                        opacity: 0.7
                    }}
                />
            )
        })
    }

    return (
        <div className='h-[600px] w-full border rounded-lg overflow-hidden'>
            <MapContainer
                center={[10.762622, 106.660172]}
                zoom={13}
                style={{ height: '100%', width: '100%', zIndex: '5' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <MapEvents />

                {/* Render route lines */}
                {renderVehicleRoutes()}

                {/* Render Depots */}
                {depots.map(depot => (
                    <Marker
                        key={depot.id}
                        position={[depot.location.x, depot.location.y]}
                        icon={
                            new L.Icon({
                                iconUrl: '/depot-marker.png', // Add your custom depot marker icon
                                iconSize: [25, 41],
                                iconAnchor: [12, 41]
                            })
                        }
                    />
                ))}

                {/* Render Customers */}
                {customers.map(customer => (
                    <Marker
                        key={customer.id}
                        position={[customer.location.x, customer.location.y]}
                        icon={
                            new L.Icon({
                                iconUrl: '/customer-marker.png', // Add your custom customer marker icon
                                iconSize: [25, 41],
                                iconAnchor: [12, 41]
                            })
                        }
                    />
                ))}
            </MapContainer>
        </div>
    )
}

export default VRPPage
