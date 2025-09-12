import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './layout/Sidebar/Sidebar';
import Header from './layout/Header/Header';
import Dashboard from './pages/Dashboard/Dashboard';
import Analytics from './pages/Analytics/Analytics';
import Sensors from './pages/Sensors/Sensors';
import Activity from './pages/Activity/Activity';
import Map from './pages/Map/Map';
import { useSensors } from './hooks/useSensors';
import './App.css';

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  
  const { data } = useSensors();

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };

  const activityBadgeCount = data.alerts.length;
  const sensorsBadgeCount = data.sensors.length;

  return (
    <div className={`app ${collapsed ? 'app--collapsed' : ''}`}>
      <Header />
      <Sidebar 
        toggleSidebar={toggleSidebar} 
        activityBadgeCount={activityBadgeCount} 
        sensorsBadgeCount={sensorsBadgeCount} 
      />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/sensors" element={<Sensors />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/map" element={<Map sensors={data.sensors} currentOrganizationId={data.organization?.id || ''} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;