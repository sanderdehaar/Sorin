import React, { useEffect, useRef } from 'react';
import maplibregl, { Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './DashboardMap.css';

interface Sensor {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  battery_level?: number;
}

interface DashboardMapProps {
  sensors: Sensor[];
}

const DashboardMap: React.FC<DashboardMapProps> = ({ sensors }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string;

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const zoomLevel = screenWidth <= 650 ? 8 : 9;

    if (!MAPTILER_KEY) {
      console.error('MapTiler API key missing!');
      return;
    }

    if (mapContainer.current && !mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/positron/style.json?key=${MAPTILER_KEY}`,
        zoom: zoomLevel,
      });
    }

    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const bounds = new maplibregl.LngLatBounds();
    let latSum = 0;
    let lngSum = 0;

    sensors.forEach(sensor => {
      const lat = sensor.latitude;
      const lng = sensor.longitude;

      if (lat == null || lng == null) return;

      const el = document.createElement('div');
      el.className = 'map-dot';

      const label = document.createElement('span');
      label.className = 'map-label';
      label.textContent = sensor.name;
      el.appendChild(label);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
      bounds.extend([lng, lat]);

      latSum += lat;
      lngSum += lng;
    });

    if (!bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds, { padding: 200, maxZoom: 10 });
    }

    const centerLat = latSum / sensors.length;
    const centerLng = lngSum / sensors.length;

    if (mapRef.current) {
      mapRef.current.setCenter([centerLng, centerLat]);
    }

  }, [sensors, MAPTILER_KEY]);

  return <div ref={mapContainer} className="map-container" />;
};

export default DashboardMap;