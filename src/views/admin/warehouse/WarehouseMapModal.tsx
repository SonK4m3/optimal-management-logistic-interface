/* eslint-disable @typescript-eslint/no-explicit-any */
import { Marker } from 'react-leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { Warehouse } from '@/types/warehouse'
import 'leaflet/dist/leaflet.css'
import { HANOI_LOCATION } from '@/constant/enum'
import MapCenterHandler from '@/components/MapCenterHandler'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
})

interface WarehouseMapModalProps {
    warehouse: Warehouse
}

const WarehouseMapModal = ({ warehouse }: WarehouseMapModalProps) => {
    const warehouseIconUrl = '/depot-marker.png'
    const center = {
        lat: warehouse.location.latitude || HANOI_LOCATION.LAT,
        lng: warehouse.location.longitude || HANOI_LOCATION.LNG
    }

    return (
        <div className='h-[600px] w-full border rounded-lg overflow-hidden'>
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%', zIndex: '5' }}
            >
                <MapCenterHandler center={center} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />

                <Marker
                    position={[warehouse.location.latitude, warehouse.location.longitude]}
                    icon={
                        new L.Icon({
                            iconUrl: warehouseIconUrl,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41]
                        })
                    }
                />
            </MapContainer>
        </div>
    )
}

export default WarehouseMapModal
