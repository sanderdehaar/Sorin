import React, { useState, useEffect } from 'react';
import DashboardMap from '../../components/DashboardMap/DashboardMap';
import Card from '../../layout/Card/Card';
import './Map.css';
import Loading from '../../components/Card/Loading/Loading';

interface Sensor {
  id: string;
  name: string;
  battery_level: number;
  status: string;
  longitude: number;
  latitude: number;
  created_at: string;
  updated_at: string;
  organization_id: string;
}

interface MapProps {
  sensors: Sensor[];
  currentOrganizationId: string;
}

const Map: React.FC<MapProps> = ({ sensors }) => {
  const [markersLoaded, setMarkersLoaded] = useState(false);

  useEffect(() => {
    if (sensors && sensors.length > 0) {
      setMarkersLoaded(true);
    }
  }, [sensors]);

  return (
    <section className="map">
      <Card className="dashboard__card dashboard__card--1" title="" cardInfo={false}>
        {markersLoaded ? (
          <DashboardMap sensors={sensors} />
        ) : (
          <Loading />
        )}
      </Card>
    </section>
  );
};

export default Map;