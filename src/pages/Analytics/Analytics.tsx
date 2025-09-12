import React, { useEffect, useState } from 'react';
import Card from '../../layout/Card/Card';
import './Analytics.css';
import { useSensors } from '../../hooks/useSensors';
import { FIXED_DATE } from '../../constants';
import LineChart from '../../components/CustomChart/CustomChart';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Dropdown from '../../components/Dropdown/Dropdown';
import { X } from "@mynaui/icons-react";
import Loading from '../../components/Card/Loading/Loading';
import { Config } from "@mynaui/icons-react";

interface Measurement {
  id: string;
  sensor_id: string;
  type: string;
  value: number;
  unit: string;
  measured_at: string;
  created_at: string;
  updated_at: string;
}

const AnalyticsPage: React.FC = () => {
  const { data, loading, error } = useSensors();
  const [filteredMeasurements, setFilteredMeasurements] = useState<Measurement[]>([]);
  const [filter, setFilter] = useState({
    type: 'soil_moisture',
    timeRange: { start: new Date(FIXED_DATE), end: new Date(new Date(FIXED_DATE).setHours(23, 59, 59, 999)) },
    sensorName: 'All Sensors',
  });

  const [tempFilter, setTempFilter] = useState(filter);
  const [showFilters, setShowFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const initialFilter = { ...filter };

  useEffect(() => {
    if (data.measurements.length > 0 && data.organization) {
      const filtered = data.measurements.filter((measurement) => {
        const measurementDate = new Date(measurement.measured_at);
        const { start, end } = filter.timeRange;
        const isInRange = measurementDate >= start && measurementDate <= end;

        const sensor = data.sensors.find(s => s.id === measurement.sensor_id);

        return (
          (filter.type ? measurement.type === filter.type : true) &&
          (filter.sensorName === 'All Sensors' || sensor?.name === filter.sensorName) &&
          isInRange
        );
      });
      setFilteredMeasurements(filtered);
    }
  }, [data.measurements, filter, data.sensors]);

  const hourlyData = Array(24).fill(0);
  filteredMeasurements.forEach((measurement) => {
    const measurementDate = new Date(measurement.measured_at);
    const hour = measurementDate.getHours();
    if (measurement.type === 'soil_moisture') hourlyData[hour] += measurement.value;
  });

  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Soil Moisture (%)',
        data: hourlyData,
        borderColor: '#66B6F0',
        borderWidth: 6,
      },
    ],
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    setTempFilter(prev => ({ ...prev, timeRange: { start: startOfDay, end: endOfDay } }));
  };

  const handleTypeChange = (type: string) => setTempFilter(prev => ({ ...prev, type }));
  const handleSensorChange = (sensorName: string) => setTempFilter(prev => ({ ...prev, sensorName }));

  const measurementTypes = ['soil_moisture', 'soil_ph', 'nutrient_npk'];
  const sensorNames = ['All Sensors', ...data.sensors
    .filter(sensor => sensor.organization_id === data.organization?.id)
    .map(sensor => sensor.name)];

  const handleSaveOptions = () => {
    setFilter(tempFilter);
    setShowFilters(false);
  };

  const handleCancelFilters = () => {
    setTempFilter(initialFilter);
    setShowFilters(false);
  };

  const handleToggleFilters = () => {
    setShowFilters(prev => !prev);
    if (showFilters) {
      setTempFilter(initialFilter);
    }
  };

  const handleDropdownToggle = (dropdown: string) => {
    setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="analytics">
      <Card className="dashboard__card dashboard__card--1" title="Analytics" cardInfo={false} showFilters={true} onToggleFilters={handleToggleFilters}>
        {showFilters && (
          <div className="filter__modal">
            <div className="filter_title">
              <h4>Filter</h4>
              <X className="icon" onClick={handleToggleFilters} />
            </div>

            <div className="filter__options">
              <Dropdown
                label="Measurement"
                options={measurementTypes}
                selectedValue={tempFilter.type}
                onSelect={handleTypeChange}
                isOpen={openDropdown === 'measurement'}
                onToggle={() => handleDropdownToggle('measurement')}
              />

              <label>
                <span>Date</span>
                <DatePicker
                  selected={tempFilter.timeRange.start}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  showYearDropdown
                  scrollableMonthYearDropdown
                  className="datepicker"
                />
              </label>

              <Dropdown
                label="Sensor"
                options={sensorNames}
                selectedValue={tempFilter.sensorName}
                onSelect={handleSensorChange}
                isOpen={openDropdown === 'sensor'}
                onToggle={() => handleDropdownToggle('sensor')}
              />

              <div className="filter__buttons">
                <button className="filter__cancel-button" onClick={handleCancelFilters}>
                  <span>Cancel</span>
                </button>
                <button className="filter__save-button" onClick={handleSaveOptions}>
                  <Config className="icon"></Config>
                  <span>Save Options</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <LineChart labels={chartData.labels} datasets={chartData.datasets} />
      </Card>
    </section>
  );
};

export default AnalyticsPage;