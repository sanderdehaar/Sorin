import React from 'react';
import { useSensors } from '../../hooks/useSensors';
import Table from '../../components/Table/Table';
import Card from '../../layout/Card/Card';
import './Activity.css';
import Loading from '../../components/Card/Loading/Loading';

const ActivityPage: React.FC = () => {
  const { data, loading, error } = useSensors();

  if (loading) return (
    <section className="activity">
      <Card className="dashboard__card dashboard__card--1" title="Activity" cardInfo={false}>
        <div className="loading-container">
          <Loading />
        </div>
      </Card>
    </section>
  );

  if (error) return <div className="error">Error: {error}</div>;

  const columns = [
    { Header: 'Sensor', accessor: 'sensor_name' },
    { Header: 'Alert', accessor: 'alert_type' },
    { Header: 'Type', accessor: 'data_type' },
    { Header: 'Value', accessor: 'value' },
    { Header: 'Message', accessor: 'message' },
    { Header: 'Alert Time', accessor: 'alert_time' },
  ];

  const alertsData = (data.alerts || []).map(alert => {
    const sensor = data.sensors.find(sensor => sensor.id === alert.sensor_id);
    return {
      ...alert,
      sensor_name: sensor ? sensor.name : 'Unknown',
    };
  });

  if (alertsData.length === 0) {
    return <div className="no-data">No alerts found for this organization.</div>;
  }

  return (
    <section className="activity">
      <Card className="dashboard__card dashboard__card--1" title="Activity" cardInfo={false}>
        <Table columns={columns} data={alertsData} />
      </Card>
    </section>
  );
};

export default ActivityPage;