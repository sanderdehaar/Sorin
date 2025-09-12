import React, { useState, useEffect } from 'react';
import { useSensors } from '../../hooks/useSensors';
import './Dashboard.css';
import { mapSoilMoistureData, mapSoilPhData, mapNutrientData } from '../../utils/sensorData';
import { getBatteryColor } from '../../utils/batteryColor';
import Card from '../../layout/Card/Card';
import Banner from '../../components/Banner/Banner';
import LineChart from '../../components/Charts/LineChart/LineChart';
import BarChart from '../../components/Charts/BarChart/BarChart';
import DonutChart from '../../components/Charts/DonutChart/DonutChart';
import Activity from '../../components/Activity/Activity';
import DashboardStats from '../../components/Card/Stats/Stats';
import { FIXED_DATE } from '../../constants';
import { getNpkValue, getLastWeekDate } from '../../utils/dataHelpers';
import Loading from '../../components/Card/Loading/Loading';

const Dashboard: React.FC = () => {
  const { data, error } = useSensors();

  const [soilMoistureLoading, setSoilMoistureLoading] = useState(true);
  const [soilPhLoading, setSoilPhLoading] = useState(true);
  const [nutrientLoading, setNutrientLoading] = useState(true);
  const [sensorLoading, setSensorLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setSoilMoistureLoading(false);
      setSoilPhLoading(false);
      setNutrientLoading(false);
      setSensorLoading(false);
      setActivityLoading(false);
    }
  }, [data]);

  if (error) return <div>Error: {error}</div>;

  const { sensors, measurements, organization, alerts } = data;

  const fixedDate = new Date(FIXED_DATE);
  const lastWeekDate = getLastWeekDate(fixedDate);

  const measurementsThisWeek = measurements.filter((m) => {
    const measuredAt = new Date(m.measured_at);
    return measuredAt >= lastWeekDate && measuredAt <= fixedDate;
  });

  const soilMoistureData = mapSoilMoistureData(measurementsThisWeek);
  const soilPhData = mapSoilPhData(measurements);
  const nutrientData = mapNutrientData(measurements);

  const batteryLevels = sensors.map(({ battery_level }) => battery_level);
  const sensorNames = sensors.map(({ name }) => name);

  const moistureLatest = soilMoistureData.datasets[0].data.at(-1) ?? 0;
  const moistureChange = moistureLatest - 25;

  const phLatest = soilPhData.datasets[0].data.at(-1) ?? 0;
  const phLastWeek = soilPhData.datasets[0].data[0] ?? 0;
  const phChange = phLastWeek ? ((phLatest - phLastWeek) / phLastWeek) * 100 : 0;

  const nutrientTotalThisWeek = getNpkValue(measurements, fixedDate);
  const nutrientTotalLastWeek = getNpkValue(measurements, lastWeekDate);

  const nutrientChange = nutrientTotalLastWeek
    ? ((nutrientTotalThisWeek - nutrientTotalLastWeek) / nutrientTotalLastWeek) * 100
    : 0;

  const nutrientDonutData = {
    labels: ['This Week', 'Last Week'],
    data: [nutrientTotalThisWeek, nutrientTotalLastWeek],
    unit: nutrientData.unit,
  };

  const soilPhBarData = {
    labels: ['Last Week', 'This Week'],
    datasets: [{
      label: 'Soil pH',
      data: [phLastWeek, phLatest],
      backgroundColor: ['#FF6F61', '#66B6F0'],
    }],
  };

  return (
    <section className="dashboard">
      <div className="dashboard__card-container">
        
        <Card className="dashboard__card dashboard__card--1" cardInfo={false}>
          {organization ? (
            <Banner title={organization.name} description={organization.description} />
          ) : (
            <Loading />
          )}
        </Card>

        <Card className="dashboard__card dashboard__card--2" title="Soil Moisture">
          {soilMoistureLoading ? (
            <Loading />
          ) : (
            <>
              <LineChart labels={soilMoistureData.labels} datasets={soilMoistureData.datasets} />
              <DashboardStats latest={moistureLatest} change={moistureChange} unit={soilMoistureData.unit} label="Soil Moisture" />
            </>
          )}
        </Card>

        <Card className="dashboard__card dashboard__card--3" title="Soil pH">
          {soilPhLoading ? (
            <Loading />
          ) : (
            <>
              <BarChart labels={soilPhBarData.labels} datasets={soilPhBarData.datasets} unit={soilPhData.unit} />
              <DashboardStats latest={phLatest} change={phChange} unit={soilPhData.unit} label="Soil pH" />
            </>
          )}
        </Card>

        <Card className="dashboard__card dashboard__card--4" title="Nutrients (NPK)">
          {nutrientLoading ? (
            <Loading />
          ) : (
            <>
              <DonutChart labels={nutrientDonutData.labels} data={nutrientDonutData.data} />
              <DashboardStats latest={nutrientTotalThisWeek} change={nutrientChange} unit={nutrientData.unit} label="Nutrients (NPK)" />
            </>
          )}
        </Card>

        <Card className="dashboard__card dashboard__card--5" title="Sensors">
          {sensorLoading ? (
            <Loading />
          ) : (
            <BarChart
              labels={sensorNames}
              datasets={[{
                label: 'Battery',
                data: batteryLevels,
                backgroundColor: batteryLevels.map((value) => getBatteryColor(value)),
              }] }
              unit="%"
              Battery={true}
            />
          )}
        </Card>

        <Card className="dashboard__card dashboard__card--6" title="Activity">
          {activityLoading ? (
            <Loading />
          ) : (
            <Activity alerts={alerts} />
          )}
        </Card>
      </div>
    </section>
  );
};

export default Dashboard;