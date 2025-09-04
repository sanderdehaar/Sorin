import React, { useEffect, useRef, useState } from 'react'
import maplibregl, { Marker } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapPin } from 'lucide-react'
import './Map.css'

export interface Sensor {
  id: string
  battery?: number
  latitude?: number
  longitude?: number
}

interface DashboardMapProps {
  sensors: Sensor[]
  onHoverSensor?: (sensor: Sensor | null) => void
}

const DashboardMap: React.FC<DashboardMapProps> = ({ sensors }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Marker[]>([])
  const [activeSensor, setActiveSensor] = useState<Sensor | null>(null)

  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY

  const handleSensorClick = (sensor: Sensor) => {
    setActiveSensor(sensor)
  }

  const generateGoogleMapsLink = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}`
  }

  useEffect(() => {
    if (!MAPTILER_KEY) return

    if (sensors.length > 0 && !activeSensor) {
      setActiveSensor(sensors[0])
    }

    if (mapContainer.current && !mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/darkmatter/style.json?key=${MAPTILER_KEY}`,
        center: [5.1214, 52.0907],
        zoom: 4,
      })
    }

    if (!mapRef.current) return

    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    const bounds = new maplibregl.LngLatBounds()

    sensors.forEach(sensor => {
      const lat = sensor.latitude
      const lng = sensor.longitude
      if (lat == null || lng == null) return

      const el = document.createElement('div')
      el.className = `map-dot ${activeSensor?.id === sensor.id ? 'active' : ''}`

      const label = document.createElement('span')
      label.className = 'map-label'
      label.textContent = `SENSOR-${sensor.id.slice(0, 5).toUpperCase()}`
      el.appendChild(label)

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(mapRef.current!)

      el.addEventListener('click', () => {
        handleSensorClick(sensor)
      })

      markersRef.current.push(marker)
      bounds.extend([lng, lat])
    })

    if (!bounds.isEmpty()) {
      const isMobile = window.innerWidth <= 750
      mapRef.current.fitBounds(bounds, {
        padding: isMobile
          ? { top: 40, right: 40, bottom: 200, left: 40 }
          : { top: 140, right: 140, bottom: 280, left: 140 },
        animate: false,
        maxZoom: 9,
      })
    }
  }, [sensors, MAPTILER_KEY, activeSensor])

  return (
    <div ref={mapContainer} className="map-container">
      {activeSensor && (
        <div className="sensor-info">
          <div className="text">
            <h3>SENSOR-{activeSensor.id.slice(0, 5).toUpperCase()}</h3>
            <p>Battery: {activeSensor.battery ? activeSensor.battery + '%' : 'N/A'}</p>
            <p>Location: {activeSensor.latitude?.toFixed(5)} / {activeSensor.longitude?.toFixed(5)}</p>
          </div>
          <button
            onClick={() => {
              if (activeSensor.latitude && activeSensor.longitude) {
                window.open(generateGoogleMapsLink(activeSensor.latitude, activeSensor.longitude), '_blank');
              }
            }}
            className="map-button"
          >
            <MapPin />
          </button>
        </div>
      )}
    </div>
  )
}

export default DashboardMap