import './Header.css'
import { Search, Bell } from 'lucide-react'
import ProfileImage from '../../assets/images/profile.png'
import Logo from '../../assets/images/logo.svg'
import { Dropdown } from '../Dropdown/Dropdown'
import { useSensors } from '../../hooks/useSensors'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ACCOUNT_ID } from '../../config/constants'

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
  isSidebarOpen?: boolean;
}

function Header({ onMenuClick, className, isSidebarOpen }: HeaderProps) {
  const { sensors, loading, error } = useSensors(ACCOUNT_ID)
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedSensors, setSelectedSensors] = useState<string[]>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && sensors.length > 0) {
      const params = new URLSearchParams(location.search)
      const sensorParam = params.get('sensor')
      if (sensorParam) {
        const ids = sensorParam
          .split(',')
          .filter(id => sensors.some(s => s.id === id))
        setSelectedSensors(ids.length ? ids : sensors.map(s => s.id))
      } else {
        setSelectedSensors(sensors.map(s => s.id))
      }
    }
  }, [loading, sensors, location.search])

  const handleSensorChange = (values: string[]) => {
    if (values.length === 0) return
    setSelectedSensors(values)
    const params = new URLSearchParams(location.search)
    params.set('sensor', values.join(','))
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
    localStorage.setItem('selectedSensors', JSON.stringify(values))
  }

  const sensorOptions = sensors.map(sensor => sensor.id)
  if (error) console.error('Error fetching sensors:', error)

  return (
    <header className={`header ${className || ''}`}>
      <div className="header-left">
        <div className="logo-box">
          <img src={Logo} alt="Logo" className="logo" />
        </div>
        <h1 className="header-title">Dashboard</h1>
        {sensors.length > 0 && (
          <div className={`header-sensor-dropdown-wrapper ${isSidebarOpen ? 'active' : ''}`}>
            <Dropdown
              options={sensorOptions}
              selected={selectedSensors}
              onSelect={handleSensorChange}
              label="SELECTED SENSORS"
              formatLabel={(val) => `SENSOR-${val.slice(0, 5).toUpperCase()}`}
              multiSelect
              localStorageKey="selectedSensors"
              selectAllOnRefresh={false}
              open={openDropdown === 'sensors'}
              setOpen={(val) => setOpenDropdown(val ? 'sensors' : null)}
            />
          </div>
        )}
      </div>
      <div className="header-right">
        <button className="icon-btn" aria-label="Search">
          <Search className="icon" />
        </button>
        <button className="alert" aria-label="Notifications">
          <Bell className="icon" />
          <span className="notification"></span>
        </button>
        <img src={ProfileImage} alt="Profile" className="header-profile" />
      </div>
      <div className="menu-icon" onClick={onMenuClick}>
        <span></span>
        <span></span>
      </div>
    </header>
  )
}

export default Header