import React, { useState, useEffect } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import ProfileImage from '../../assets/images/profile.png'
import './Menu.css'

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200 && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

    useEffect(() => {
    const htmlEl = document.documentElement
    const bodyEl = document.body

    htmlEl.classList.toggle('no-scroll', isOpen)
    bodyEl.classList.toggle('no-scroll', isOpen)

    return () => {
        htmlEl.classList.remove('no-scroll')
        bodyEl.classList.remove('no-scroll')
    }
    }, [isOpen])

  const extraItems = (
    <div className="sidebar-extra">
      <img src={ProfileImage} alt="Profile" className="sidebar-profile" />
    </div>
  )

  return (
    <div className="menu-container">
      <Header
        onMenuClick={toggleMenu}
        className="mobile-header"
        isSidebarOpen={isOpen}
      />
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={closeMenu}
      />
      <div className={`sidebar-wrapper ${isOpen ? 'open' : ''}`}>
        <Sidebar
          className="mobile-sidebar"
          onMenuClick={toggleMenu}
          extraItems={extraItems}
        />
      </div>
    </div>
  )
}

export default Menu