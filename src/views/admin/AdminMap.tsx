/* eslint-disable @typescript-eslint/no-explicit-any */
import { Marker, Popup } from 'react-leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'
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

    const { orders, warehouses } = useAdminContext()

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
                        key={order.orderId}
                        position={[
                            order.delivery?.deliveryLocation.latitude || 0,
                            order.delivery?.deliveryLocation.longitude || 0
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
                            <div>{order.orderId}</div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default AdminMap
