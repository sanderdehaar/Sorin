import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import Dashboard from './pages/Dashboard/Dashboard'
import Analytics from './pages/Analytics/Analytics'
import Map from './pages/Map/Map'
import Alerts from './pages/Alerts/Alerts'
import Menu from './components/Menu/Menu'
import { useLocation } from 'react-router-dom'

function App() {
  const location = useLocation()
  const page = location.pathname.replace('/', '') || 'dashboard'

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />
      case 'analytics': return <Analytics />
      case 'map': return <Map />
      case 'alerts': return <Alerts />
      default: return <Dashboard />
    }
  }

  return (
    <div className="app">
      <Sidebar />
      <main>
        <Header />
        <Menu />
        {renderPage()}
      </main>
    </div>
  )
}

export default App