import { useEffect } from 'react'

import { useMap } from 'react-leaflet'

// Component to handle map center changes
const MapCenterHandler = ({ center }: { center: { lat: number; lng: number } }) => {
    const map = useMap()

    useEffect(() => {
        map.setView([center.lat, center.lng], map.getZoom())
    }, [center, map])

    return null
}

export default MapCenterHandler
