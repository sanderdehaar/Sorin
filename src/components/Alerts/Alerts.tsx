import './Alerts.css'
import React, { useState, useEffect } from 'react'
import type { Alert } from '../../hooks/useSensors'

interface AlertsProps {
  alerts: Alert[]
  selectedSensorIds: string[]
  limit?: number
}

const Alerts: React.FC<AlertsProps> = ({ alerts, selectedSensorIds, limit = 2 }) => {
  const [maxAlerts, setMaxAlerts] = useState(limit)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 750) {
        setMaxAlerts(1)
      } else {
        setMaxAlerts(limit)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [limit])

  const filteredAlerts = alerts.filter(alert => selectedSensorIds.includes(alert.sensor_id))

  const sortedAlerts = filteredAlerts.sort(
    (a, b) => new Date(b.alert_time).getTime() - new Date(a.alert_time).getTime()
  )

  const displayedAlerts = sortedAlerts.slice(0, maxAlerts)

  return (
    <table className="alerts-table">
      <tbody>
        {displayedAlerts.map(alert => (
          <tr key={alert.id}>
            <td data-label="Sensor">{`SENSOR-${alert.sensor_id.slice(0, 5).toUpperCase()}`}</td>
            <td data-label="Time">{new Date(alert.alert_time).toLocaleString()}</td>
            <td data-label="Type" className={`alert ${alert.alert_type.toLowerCase()}`}>
              {alert.alert_type}
            </td>
            <td data-label="Data">{alert.data_type}</td>
            <td data-label="Message" className={`message ${alert.alert_type.toLowerCase()}`}>
              {alert.message}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Alerts