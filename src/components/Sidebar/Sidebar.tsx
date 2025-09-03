import './Sidebar.css'
import Logo from '../../assets/images/logo.svg'
import { LayoutDashboard, ChartSpline, Map, ShieldAlert, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface SidebarProps {
  className?: string
  onMenuClick?: () => void
  extraItems?: React.ReactNode
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'analytics', icon: ChartSpline, label: 'Analytics' },
  { id: 'map', icon: Map, label: 'Map' },
  { id: 'alerts', icon: ShieldAlert, label: 'Alerts' },
]

const bottomItems = [
  { id: 'logout', icon: LogOut, label: 'Logout' },
]

const Sidebar: React.FC<SidebarProps> = ({ className, extraItems, onMenuClick }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [active, setActive] = useState(location.pathname.replace('/', '') || 'dashboard')

  useEffect(() => {
    setActive(location.pathname.replace('/', '') || 'dashboard')
  }, [location.pathname])

  const handleClick = (id: string) => {
    setActive(id)
    navigate(`/${id}${location.search}`, { replace: false })

    // close sidebar on mobile if callback exists
    if (onMenuClick) onMenuClick()
  }

  return (
    <aside className={`sidebar ${className || ''}`}>
      <div className="logo-box">
        <img src={Logo} alt="Logo" className="logo" />
      </div>

      {extraItems && <div className="sidebar-extra-wrapper">{extraItems}</div>}

      <nav className="nav-middle">
        <ul>
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <li
                key={item.id}
                className="nav-item"
                data-active={active === item.id ? 'true' : 'false'}
                onClick={() => handleClick(item.id)}
              >
                <Icon className="icon" />
                <span className="nav-label">{item.label}</span>
              </li>
            )
          })}
        </ul>
      </nav>

      <nav className="nav-bottom">
        <ul>
          {bottomItems.map(item => {
            const Icon = item.icon
            return (
              <li
                key={item.id}
                className="nav-item"
                onClick={() => handleClick(item.id)}
              >
                <Icon className="icon" />
                <span className="nav-label">{item.label}</span>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar