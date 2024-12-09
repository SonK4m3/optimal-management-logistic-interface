/* eslint-disable @typescript-eslint/no-explicit-any */
import { Marker } from 'react-leaflet'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { Driver } from '@/types/driver'
import { Delivery } from '@/types/order'
import { Warehouse } from '@/types/warehouse'
import { generateVehicleColor } from '@/lib/color'
import 'leaflet/dist/leaflet.css'
import { MapClickHandler } from '@/components/AppMap'
import { HANOI_LOCATION } from '@/constant/enum'
import MapCenterHandler from '@/components/MapCenterHandler'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
})

interface DriverMapProps {
    center: {
        lat: number
        lng: number
    }
    driver: Driver | null
    delivery: Delivery | null | undefined
    warehouses: Warehouse[]
    onClickToMap: (marker: { lat: number; lng: number }) => void
    currentMarker: { lat: number; lng: number } | null
}

const DriverMap = ({
    center = { lat: HANOI_LOCATION.LAT, lng: HANOI_LOCATION.LNG },
    driver,
    delivery,
    warehouses,
    onClickToMap,
    currentMarker
}: DriverMapProps) => {
    const orderIconUrl = '/customer-marker.png'
    const warehouseIconUrl = '/depot-marker.png'
    const driverIconUrl = '/driver-marker.png'

    const renderDeliveryRoute = () => {
        if (!driver || !delivery || !driver.currentLatitude || !driver.currentLongitude) return null

        // Create array of positions starting with driver location
        const positions: [number, number][] = [[driver.currentLatitude, driver.currentLongitude]]

        // Add order delivery locations
        positions.push([
            delivery?.deliveryLocation.latitude || 0,
            delivery?.deliveryLocation.longitude || 0
        ])

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
                center={[center.lat, center.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%', zIndex: '5' }}
            >
                <MapCenterHandler center={center} />

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
                        position={[warehouse.location.latitude, warehouse.location.longitude]}
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
                {delivery && (
                    <Marker
                        key={delivery.id}
                        position={[
                            delivery.deliveryLocation.latitude || 0,
                            delivery.deliveryLocation.longitude || 0
                        ]}
                        icon={
                            new L.Icon({
                                iconUrl: orderIconUrl,
                                iconSize: [25, 41],
                                iconAnchor: [12, 41]
                            })
                        }
                    />
                )}
            </MapContainer>
        </div>
    )
}

export default DriverMap
