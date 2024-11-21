/* eslint-disable @typescript-eslint/no-explicit-any */
import { Marker, Popup } from 'react-leaflet'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { generateVehicleColor } from '@/lib/color'
import 'leaflet/dist/leaflet.css'
import { useAdminContext } from '@/contexts/AdminContext'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
})

const AdminMap = () => {
    const orderIconUrl = '/customer-marker.png'
    const warehouseIconUrl = '/depot-marker.png'
    const driverIconUrl = '/driver-marker.png'

    const { drivers, orders, warehouses } = useAdminContext()

    const renderDeliveryRoutes = () => {
        if (!drivers.length || !orders.length) return null

        return drivers.map((driver, index) => {
            if (!driver.currentLatitude || !driver.currentLongitude) return null

            // Create array of positions starting with driver location
            const positions: [number, number][] = [
                [driver.currentLatitude, driver.currentLongitude]
            ]

            // Add assigned order delivery locations for this driver
            const driverOrders = orders.filter(order => order.id === driver.id)
            driverOrders.forEach(order => {
                positions.push([order.receiverLocation.latitude, order.receiverLocation.longitude])
            })

            return (
                <Polyline
                    key={driver.id}
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

                {/* Render delivery routes */}
                {renderDeliveryRoutes()}

                {/* Render Driver Positions */}
                {drivers.map(
                    driver =>
                        driver.currentLatitude &&
                        driver.currentLongitude && (
                            <Marker
                                key={driver.id}
                                position={[driver.currentLatitude, driver.currentLongitude]}
                                icon={
                                    new L.Icon({
                                        iconUrl: driverIconUrl,
                                        iconSize: [25, 41],
                                        iconAnchor: [12, 41]
                                    })
                                }
                                title='driver'
                            >
                                <Popup>
                                    <div>{driver.fullName}</div>
                                </Popup>
                            </Marker>
                        )
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
                        title='warehouse'
                    >
                        <Popup>
                            <div>{warehouse.name}</div>
                        </Popup>
                    </Marker>
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
                        title='order'
                    >
                        <Popup>
                            <div>{order.id}</div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default AdminMap
