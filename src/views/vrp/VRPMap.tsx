/* eslint-disable @typescript-eslint/no-explicit-any */
import { Marker } from 'react-leaflet'
import { MapContainer, TileLayer, useMapEvents, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { Depot, Customer, Vehicle, Location, MarkerType } from '@/types/vrp'
import { generateVehicleColor } from '@/lib/color'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
})

interface MapProps {
    depots: Depot[]
    customers: Customer[]
    vehicles: Vehicle[]
    activeMarkerType: MarkerType
    onLocationAdd: (location: Location, type: MarkerType) => void
    id: number
    updateId: (id: number) => void
}

const VRPMap: React.FC<MapProps> = ({
    depots,
    customers,
    vehicles,
    activeMarkerType,
    onLocationAdd,
    id,
    updateId
}) => {
    const MapEvents = () => {
        useMapEvents({
            click: e => {
                if (activeMarkerType) {
                    const newLocation: Location = {
                        id: id,
                        x: e.latlng.lat,
                        y: e.latlng.lng
                    }
                    onLocationAdd(newLocation, activeMarkerType)
                    updateId(id + 1)
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

export default VRPMap
