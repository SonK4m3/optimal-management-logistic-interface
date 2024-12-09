import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { HANOI_LOCATION } from '@/constant/enum'
interface AppMapProps {
    center: [number, number]
    zoom: number
    width?: string
    height?: string
    currentMarker?: { lat: number; lng: number }
    onMarkerClick: (marker: { lat: number; lng: number }) => void
}

// Component to handle map click events
export const MapClickHandler = ({
    onMarkerClick
}: {
    onMarkerClick: (marker: { lat: number; lng: number }) => void
}) => {
    useMapEvents({
        click: e => {
            onMarkerClick({ lat: e.latlng.lat, lng: e.latlng.lng })
        }
    })
    return null
}

const AppMap = ({
    center = [HANOI_LOCATION.LAT, HANOI_LOCATION.LNG],
    zoom = 13,
    onMarkerClick,
    currentMarker,
    height = '600px',
    width = '100%'
}: AppMapProps) => {
    const handleMarkerClick = (position: { lat: number; lng: number }) => {
        onMarkerClick(position)
    }

    return (
        <div className={`h-[${height}] w-[${width}] border rounded-lg overflow-hidden`}>
            <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <MapClickHandler onMarkerClick={handleMarkerClick} />

                {currentMarker && (
                    <Marker position={[currentMarker.lat, currentMarker.lng]}>
                        <Popup>
                            Marker
                            <br />
                            Lat: {currentMarker.lat.toFixed(4)}
                            <br />
                            Lng: {currentMarker.lng.toFixed(4)}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    )
}

export default AppMap
