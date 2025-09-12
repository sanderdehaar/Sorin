import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'
import { Grid, ChartBarOne, Zap, Radio, Map, QuestionCircle, CogFour, PanelLeftClose, PanelRightClose } from "@mynaui/icons-react"
import Logo from "../../assets/images/logo.svg"

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  badge?: number
}

interface SidebarProps {
  toggleSidebar: () => void
  activityBadgeCount: number
  sensorsBadgeCount: number
}

const sidebarTopItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Grid, path: '/' },
  { id: 'analytics', label: 'Analytics', icon: ChartBarOne, path: '/analytics' },
  { id: 'activity', label: 'Activity', icon: Zap, path: '/activity', badge: 3 },
  { id: 'sensors', label: 'Sensors', icon: Radio, path: '/sensors', badge: 3 },
  { id: 'map', label: 'Map', icon: Map, path: '/map' }
]

const sidebarBottomItems: SidebarItem[] = [
  { id: 'help', label: 'Help center', icon: QuestionCircle, path: '/help' },
  { id: 'settings', label: 'Settings', icon: CogFour, path: '/settings' }
]

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar, activityBadgeCount, sensorsBadgeCount }) => {
  const [collapsed, setCollapsed] = useState<boolean>(localStorage.getItem('sidebarCollapsed') === 'true')

  const handleToggle = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', newState.toString())
    toggleSidebar()
  }

  const renderItem = (item: SidebarItem) => {
    const Icon = item.icon
    return (
      <li key={item.id}>
        <NavLink
          to={item.path}
          className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
        >
          <Icon className="icon" />
          <p>{!collapsed && item.label}</p>
        </NavLink>
        {!collapsed && item.badge && <span className="sidebar__badge">{item.badge}</span>}
      </li>
    )
  }

  sidebarTopItems[2].badge = activityBadgeCount
  sidebarTopItems[3].badge = sensorsBadgeCount

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__top">
        {!collapsed && <a href="/"><img src={Logo} alt="logo"/></a>}
        {collapsed ? (
          <PanelRightClose className="icon sidebar__top--close" onClick={handleToggle} />
        ) : (
          <PanelLeftClose className="icon sidebar__top--close" onClick={handleToggle} />
        )}
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__nav--top">
          {sidebarTopItems.map(renderItem)}
        </ul>

        <ul className="sidebar__nav--bottom">
          {sidebarBottomItems.map(renderItem)}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar