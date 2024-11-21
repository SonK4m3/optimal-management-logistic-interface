/* eslint-disable @typescript-eslint/no-explicit-any */
import { Marker } from 'react-leaflet'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { Driver } from '@/types/driver'
import { Order } from '@/types/order'
import { Warehouse } from '@/types/warehouse'
import { generateVehicleColor } from '@/lib/color'
import 'leaflet/dist/leaflet.css'
import { MapClickHandler } from '@/components/AppMap'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
})

interface DriverMapProps {
    driver: Driver | null
    orders: Order[]
    warehouses: Warehouse[]
    onClickToMap: (marker: { lat: number; lng: number }) => void
    currentMarker: { lat: number; lng: number } | null
}

const DriverMap = ({ driver, orders, warehouses, onClickToMap, currentMarker }: DriverMapProps) => {
    const orderIconUrl = '/customer-marker.png'
    const warehouseIconUrl = '/depot-marker.png'
    const driverIconUrl = '/driver-marker.png'

    const renderDeliveryRoute = () => {
        if (!driver || !orders.length || !driver.currentLatitude || !driver.currentLongitude)
            return null

        // Create array of positions starting with driver location
        const positions: [number, number][] = [[driver.currentLatitude, driver.currentLongitude]]

        // Add order delivery locations
        orders.forEach(order => {
            positions.push([order.receiverLocation.latitude, order.receiverLocation.longitude])
        })

        return (
            <Polyline
                positions={positions}
                pathOptions={{
                    color: generateVehicleColor(0),
                    weight: 3,
                    opacity: 0.7
                }}
            />
        )
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

                <MapClickHandler onMarkerClick={onClickToMap} />

                {currentMarker && <Marker position={[currentMarker.lat, currentMarker.lng]} />}

                {/* Render delivery route */}
                {renderDeliveryRoute()}

                {/* Render Driver Position */}
                {driver && driver.currentLatitude && driver.currentLongitude && (
                    <Marker
                        position={[driver.currentLatitude, driver.currentLongitude]}
                        icon={
                            new L.Icon({
                                iconUrl: driverIconUrl,
                                iconSize: [25, 41],
                                iconAnchor: [12, 41]
                            })
                        }
                    />
                )}

                {/* Render Warehouses */}
                {warehouses.map(warehouse => (
                    <Marker
                        key={warehouse.id}
                        position={[warehouse.latitude, warehouse.longitude]}
                        icon={
                            new L.Icon({
                                iconUrl: warehouseIconUrl,
                                iconSize: [25, 41],
                                iconAnchor: [12, 41]
                            })
                        }
                    />
                ))}

                {/* Render Order Delivery Locations */}
                {orders.map(order => (
                    <Marker
                        key={order.id}
                        position={[
                            order.receiverLocation.latitude,
                            order.receiverLocation.longitude
                        ]}
                        icon={
                            new L.Icon({
                                iconUrl: orderIconUrl,
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

export default DriverMap
