import React, { useEffect, useRef } from 'react'
import maplibregl, { Marker, Popup } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import './map.css'

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

const DashboardMap: React.FC<DashboardMapProps> = ({ sensors, onHoverSensor }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Marker[]>([])
  const hoverPopupRef = useRef<Popup | null>(null)

  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY

  useEffect(() => {
    if (!MAPTILER_KEY) return

    // init map
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/darkmatter/style.json?key=${MAPTILER_KEY}`,
        center: [5.1214, 52.0907],
        zoom: 4,
      })
    }

    if (!mapRef.current) return

    // clear old markers + popup
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []
    if (hoverPopupRef.current) {
      hoverPopupRef.current.remove()
      hoverPopupRef.current = null
    }

    const bounds = new maplibregl.LngLatBounds()

    sensors.forEach(sensor => {
      const lat = sensor.latitude
      const lng = sensor.longitude
      if (lat == null || lng == null) return

      const el = document.createElement('div')
      el.className = 'map-dot'

      const label = document.createElement('span')
      label.className = 'map-label'
      label.textContent = `SENSOR-${sensor.id.slice(0, 5).toUpperCase()}`
      el.appendChild(label)

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(mapRef.current!)

      el.addEventListener('mouseenter', () => {
        if (hoverPopupRef.current) hoverPopupRef.current.remove()

        const popup = new maplibregl.Popup({ offset: 25 })
          .setLngLat([lng, lat])
          .setHTML(`Lat: ${lat.toFixed(5)}<br/>Lng: ${lng.toFixed(5)}`)
        popup.addTo(mapRef.current!)
        hoverPopupRef.current = popup

        onHoverSensor?.(sensor)
      })

      el.addEventListener('mouseleave', () => {
        if (hoverPopupRef.current) {
          hoverPopupRef.current.remove()
          hoverPopupRef.current = null
        }
        onHoverSensor?.(null)
      })

      markersRef.current.push(marker)
      bounds.extend([lng, lat])
    })

    if (!bounds.isEmpty()) {
      const isMobile = window.innerWidth <= 768
      mapRef.current.fitBounds(bounds, {
        padding: isMobile
          ? { top: 40, right: 40, bottom: 110, left: 40 }
          : { top: 140, right: 140, bottom: 200, left: 140 },
        animate: false,
        maxZoom: 10,
      })
    }
  }, [sensors, MAPTILER_KEY, onHoverSensor])

  return <div ref={mapContainer} className="map-container" />
}

export default DashboardMap