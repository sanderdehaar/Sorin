import { useState, useEffect } from 'react';
import supabase from '../data/supabaseClient';

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

export interface Measurement {
  id: string;
  sensor_id: string;
  type: string;
  value: number;
  unit: string;
  measured_at: string;
  created_at: string;
  updated_at: string;
}

interface Alert {
  id: string;
  sensor_id: string;
  alert_type: string;
  data_type: string;
  value: number;
  message: string;
  alert_time: string;
  created_at: string;
  updated_at: string;
  title: string;
}

interface Organization {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface SensorData {
  sensors: Sensor[];
  measurements: Measurement[];
  alerts: Alert[];
  organization: Organization | null;
}

export function useSensors() {
  const [data, setData] = useState<SensorData>({
    sensors: [],
    measurements: [],
    alerts: [],
    organization: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sensorsRes, measurementsRes, alertsRes, organizationRes] = await Promise.all([
          supabase.from('sensors').select('*'),
          supabase.from('measurements').select('*'),
          supabase.from('alerts').select('*'),
          supabase.from('organizations').select('*').limit(1),
        ]);

        if (sensorsRes.error) throw new Error(`Error fetching sensors: ${sensorsRes.error.message}`);
        if (measurementsRes.error) throw new Error(`Error fetching measurements: ${measurementsRes.error.message}`);
        if (alertsRes.error) throw new Error(`Error fetching alerts: ${alertsRes.error.message}`);
        if (organizationRes.error) throw new Error(`Error fetching organization: ${organizationRes.error.message}`);

        setData({
          sensors: sensorsRes.data || [],
          measurements: measurementsRes.data || [],
          alerts: alertsRes.data || [],
          organization: organizationRes.data && organizationRes.data[0] ? organizationRes.data[0] : null,
        });
      } catch (err: any) {
        console.error('Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
