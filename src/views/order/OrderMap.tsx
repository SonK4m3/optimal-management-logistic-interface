/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderWithFee } from '@/types/order'
import { Warehouse } from '@/types/warehouse'
import { Marker, Popup } from 'react-leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Driver } from '@/types/driver'
import MapCenterHandler from '@/components/MapCenterHandler'
import { HANOI_LOCATION } from '@/constant/enum'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
})

interface OrderMapProps {
    center: {
        latitude: number
        longitude: number
    }
    order: OrderWithFee
    warehouses: Warehouse[]
    drivers: Driver[]
    highlight?: {
        warehouseIds?: number[]
        driverIds?: number[]
    }
}

const OrderMap = ({
    center,
    order,
    warehouses,
    drivers,
    highlight
}: OrderMapProps): React.ReactElement => {
    const orderIconUrl = '/customer-marker.png'
    const warehouseIconUrl = '/depot-marker.png'
    const driverIconUrl = '/driver-marker.png'

    return (
        <div className='h-[600px] w-full border rounded-lg overflow-hidden'>
            <MapContainer
                center={[HANOI_LOCATION.LAT, HANOI_LOCATION.LNG]}
                zoom={13}
                style={{ height: '100%', width: '100%', zIndex: '5' }}
            >
                <MapCenterHandler center={{ lat: center.latitude, lng: center.longitude }} />

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
                                iconSize: [32, 32],
                                iconAnchor: [16, 32],
                                className: highlight?.warehouseIds?.includes(warehouse.id)
                                    ? 'border-2 border-red-600 rounded-full w-4 h-4 border-dashed'
                                    : ''
                            })
                        }
                        title='warehouse'
                    >
                        <Popup>
                            <div
                                className={
                                    highlight?.warehouseIds?.includes(warehouse.id)
                                        ? 'font-bold text-blue-600'
                                        : ''
                                }
                            >
                                {warehouse.name}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Render Order Delivery Location */}
                {order.delivery?.deliveryLocation && (
                    <Marker
                        position={[
                            order.delivery.deliveryLocation.latitude,
                            order.delivery.deliveryLocation.longitude
                        ]}
                        icon={
                            new L.Icon({
                                iconUrl: orderIconUrl,
                                iconSize: [32, 32],
                                iconAnchor: [16, 32]
                            })
                        }
                        title='order'
                    >
                        <Popup>
                            <div>{order.orderCode}</div>
                            <div>{order.delivery.deliveryLocation.address}</div>
                        </Popup>
                    </Marker>
                )}

                {/* Render Drivers */}
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
                                        iconSize: [32, 32],
                                        iconAnchor: [16, 32],
                                        className: highlight?.driverIds?.includes(driver.id)
                                            ? 'border-2 border-red-600 rounded-full w-4 h-4 border-dashed'
                                            : ''
                                    })
                                }
                            >
                                <Popup>
                                    <div
                                        className={
                                            highlight?.driverIds?.includes(driver.id)
                                                ? 'font-bold text-blue-600'
                                                : ''
                                        }
                                    >
                                        {driver.fullName}
                                    </div>
                                </Popup>
                            </Marker>
                        )
                )}
            </MapContainer>
        </div>
    )
}

export default OrderMap
