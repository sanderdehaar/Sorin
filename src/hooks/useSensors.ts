import { useState, useEffect } from 'react'
import { supabase } from '../api/supabaseClient'

export interface Sensor {
  id: string
  name?: string
  account_id: string
  battery?: number
  last_seen?: string
  longitude?: number
  latitude?: number
}

export interface Measurement {
  id: string
  sensor_id: string
  type: string
  value: number
  measured_at: string
}

export interface Alert {
  id: string
  sensor_id: string
  alert_type: 'info' | 'warning' | 'danger'
  data_type: string
  value: number | string
  message: string
  alert_time: string
}

export function useSensors(accountId: string) {
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const { data: sensorData, error: sensorError } = await supabase
          .from('sensors')
          .select('*')
          .eq('account_id', accountId)

        if (sensorError) throw sensorError
        setSensors(sensorData as Sensor[] || [])

        if (sensorData?.length) {
          const sensorIds = (sensorData as Sensor[]).map(s => s.id)

          const { data: measurementData, error: measError } = await supabase
            .from('measurements')
            .select('*')
            .in('sensor_id', sensorIds)
            .order('measured_at', { ascending: true })

          if (measError) throw measError
          setMeasurements(measurementData as Measurement[] || [])

          const { data: alertData, error: alertError } = await supabase
            .from('alerts')
            .select('*')
            .in('sensor_id', sensorIds)
            .order('alert_time', { ascending: false })

          if (alertError) throw alertError
          setAlerts(alertData as Alert[] || [])
        }
      } catch (err: any) {
        setError(err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [accountId])

  return { sensors, measurements, alerts, loading, error }
}