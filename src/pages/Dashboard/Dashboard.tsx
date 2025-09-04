import React, { useState, useEffect, useMemo } from 'react'
import Card from '../../components/Card/Card'
import { Dropdown } from '../../components/Dropdown/Dropdown'
import LineChart, { type LineChartDataset } from '../../components/LineChart/LineChart'
import { useSensors } from '../../hooks/useSensors'
import { useSearchParams } from 'react-router-dom'
import { ACCOUNT_ID } from '../../config/constants'
import DashboardMap from '../../components/Map/Map'
// import Battery from '../../components/Battery/Battery'
import Alerts from '../../components/Alerts/Alerts'

import './Dashboard.css'

const measurementOptions = ['Humidity (%)', 'Temperature (°C)', 'Pressure (pH)']
const timeOptions = ['12h', '24h']
const colorPalette = [
  '#66BB6A', '#EF5350', '#42A5F5', '#FFCA28',
  '#AB47BC', '#26C6DA', '#FF7043', '#8D6E63'
]

const DEFAULT_PREVIEW_DATE = new Date(2025, 8, 1)

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { sensors, measurements, alerts, loading, error } = useSensors(ACCOUNT_ID)

  const [selectedMeasurements, setSelectedMeasurements] = useState<string[]>(['Humidity (%)'])
  const [chartLabels, setChartLabels] = useState<string[]>([])
  const [chartDatasets, setChartDatasets] = useState<LineChartDataset[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const storedDate = localStorage.getItem('selectedDate')
    return storedDate ? new Date(JSON.parse(storedDate)) : DEFAULT_PREVIEW_DATE
  })
  const [timeRange, setTimeRange] = useState<'12h' | '24h'>(() => {
    const stored = localStorage.getItem('selectedTimeRange')
    return stored === '24h' ? '24h' : '12h'
  })

  const [hoveredSensor, setHoveredSensor] = useState<any | null>(null)

  useEffect(() => {
    if (sensors.length && !hoveredSensor) {
      setHoveredSensor(sensors[0])
    }
  }, [sensors, hoveredSensor])

  useEffect(() => {
    localStorage.setItem('selectedDate', JSON.stringify(selectedDate))
  }, [selectedDate])

  const selectedSensorIds = useMemo(() => {
    if (!sensors.length) return []

    const sensorParam = searchParams.get('sensor') || ''
    const idsFromUrl = sensorParam.split(',').filter(Boolean)
    if (idsFromUrl.length) return idsFromUrl

    const stored = localStorage.getItem('selectedSensors')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length) {
          return parsed.filter(id => sensors.some(s => s.id === id))
        }
      } catch {}
    }

    return sensors.length ? [sensors[0].id] : []
  }, [searchParams, sensors])

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleMeasurementChange = (values: string[]) => {
    if (values.length) setSelectedMeasurements(values)
  }

  const handleTimeChange = (values: string[]) => {
    if (values.length) {
      setTimeRange(values[0] as '12h' | '24h')
      localStorage.setItem('selectedTimeRange', JSON.stringify(values[0]))
    }
  }

  useEffect(() => {
    if (!selectedSensorIds.length || !selectedMeasurements.length || !measurements.length) return

    const type = selectedMeasurements[0].split(' ')[0].toLowerCase()
    const hoursToShow = timeRange === '12h' ? 12 : 24

    const endTime = new Date(selectedDate)
    endTime.setHours(24, 0, 0, 0)

    const startTime = new Date(endTime)
    startTime.setHours(endTime.getHours() - hoursToShow, 0, 0, 0)

    const labels: string[] = []
    const timePoints: Date[] = []

    for (let i = 0; i < hoursToShow; i++) {
      const d = new Date(startTime)
      d.setHours(startTime.getHours() + i)
      timePoints.push(d)
    }

    timePoints.forEach((d) => {
      const hours = d.getHours()
      const displayHour = hours === 24 ? '24' : hours.toString().padStart(2, '0')
      labels.push(`${displayHour}:00`)
    })

    setChartLabels(labels)

    const datasets: LineChartDataset[] = selectedSensorIds.map((sensorId, idx) => {
      const sensorMeasurements = measurements
        .filter(m => m.sensor_id === sensorId && m.type.toLowerCase().includes(type))
        .map(m => ({ ...m, measured_at: new Date(m.measured_at) }))

      const dataPoints = timePoints.map((timePoint) => {
        const hourStart = new Date(timePoint)
        hourStart.setMinutes(0, 0, 0)
        const hourEnd = new Date(hourStart)
        hourEnd.setHours(hourEnd.getHours() + 1)

        const found = sensorMeasurements.find(m => {
          const measuredTime = new Date(m.measured_at)
          return measuredTime >= hourStart && measuredTime < hourEnd
        })
        return found ? found.value : null
      })

      const sensorName = sensors.find(s => s.id === sensorId)?.id
      const formattedLabel = sensorName ? `SENSOR-${sensorName.slice(0, 5).toUpperCase()}` : `Sensor ${idx + 1}`

      return { label: formattedLabel, data: dataPoints, borderColor: colorPalette[idx % colorPalette.length] }
    })

    setChartDatasets(datasets)
  }, [measurements, selectedSensorIds, selectedMeasurements, sensors, selectedDate, timeRange])

  if (error) return <div>Error: {error}</div>

  return (
    <div className="dashboard">
      <Card className="card1" loading={loading && !chartDatasets.length}>
        {!loading && (
          <>
            <div className="top">
              <h2>{selectedMeasurements[0] || 'Measurements'}</h2>
              <div className="right">
                <div className="datepicker">
                  <Dropdown
                    type="date"
                    value={selectedDate}
                    onDateChange={(date) => { if (date) setSelectedDate(date) }}
                    label="Date"
                    open={openDropdown === 'date'}
                    setOpen={(val) => setOpenDropdown(val ? 'date' : null)}
                  />
                </div>
                <Dropdown
                  options={measurementOptions}
                  selected={selectedMeasurements}
                  onSelect={handleMeasurementChange}
                  label="Type"
                  multiSelect={false}
                  singleSelect
                  localStorageKey="selectedMeasurements"
                  open={openDropdown === 'type'}
                  setOpen={(val) => setOpenDropdown(val ? 'type' : null)}
                />
                <Dropdown
                  options={timeOptions}
                  selected={[timeRange]}
                  onSelect={handleTimeChange}
                  label="Time"
                  multiSelect={false}
                  singleSelect
                  localStorageKey="selectedTimeRange"
                  open={openDropdown === 'time'}
                  setOpen={(val) => setOpenDropdown(val ? 'time' : null)}
                />
              </div>
            </div>
            <LineChart labels={chartLabels} datasets={chartDatasets} />
          </>
        )}
      </Card>

      <Card className="card2" loading={loading && !sensors.length}>
        {!loading && (
          <>
            <div className="top">
              <div className="text">
                <h2>Sensors</h2>
                <span className="sensor-last-seen">
                  Last activity recorded at: {new Date(hoveredSensor.last_seen).toLocaleString()}
                </span>
              </div>
            </div>
            <DashboardMap
              sensors={sensors}
            />
          </>
        )}
      </Card>

      <Card className="card3" loading={loading && !alerts.length}>
        <div className="top">
          <h2>Alerts</h2>
          <button>View all</button>
        </div>
        {!loading && (
          <Alerts
            alerts={alerts}
            selectedSensorIds={selectedSensorIds}
            limit={2}
          />
        )}
      </Card>
    </div>
  )
}

export default Dashboard