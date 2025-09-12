import React from 'react';
import { useSensors } from '../../hooks/useSensors';
import Table from '../../components/Table/Table';
import Card from '../../layout/Card/Card';
import './Sensors.css';
import Loading from '../../components/Card/Loading/Loading';

const SensorsPage: React.FC = () => {
  const { data, loading, error } = useSensors();

  if (loading) return (
    <section className="sensors">
      <Card className="dashboard__card dashboard__card--1" title="Sensors" cardInfo={false}>
        <div className="loading-container">
          <Loading />
        </div>
      </Card>
    </section>
  );

  if (error) return <div className="error">Error: {error}</div>;

  const columns = [
    { Header: 'Sensor ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Battery Level', accessor: 'battery_level' },
    { Header: 'Status', accessor: 'status' },
  ];

  const sensorsData = data.sensors || [];

  if (sensorsData.length === 0) {
    return <div className="no-data">No sensors found for this organization.</div>;
  }

  return (
    <section className="sensors">
      <Card className="dashboard__card dashboard__card--1" title="Sensors" cardInfo={false}>
        <Table columns={columns} data={sensorsData} />
      </Card>
    </section>
  );
};

export default SensorsPage;