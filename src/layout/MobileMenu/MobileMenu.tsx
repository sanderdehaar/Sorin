import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './MobileMenu.css';
import { Grid, ChartBarOne, Zap, Radio, Map, QuestionCircle, CogFour, UserCircle, ChevronRight, Logout } from "@mynaui/icons-react";

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLinkClick: () => void;
}

const mobileMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: Grid },
  { id: 'analytics', label: 'Analytics', path: '/analytics', icon: ChartBarOne },
  { id: 'activity', label: 'Activity', path: '/activity', icon: Zap },
  { id: 'sensors', label: 'Sensors', path: '/sensors', icon: Radio },
  { id: 'map', label: 'Map', path: '/map', icon: Map },
  { id: 'account', label: 'Account', path: '/account', icon: UserCircle },
  { id: 'help', label: 'Help center', path: '/help', icon: QuestionCircle },
  { id: 'settings', label: 'Settings', path: '/settings', icon: CogFour },
  { id: 'logout', label: 'Logout', path: '/logout', icon: Logout },
];

const MobileMenu: React.FC<MobileMenuProps> = ({ menuOpen, setMenuOpen, handleLinkClick }) => {
  useEffect(() => {
    const appElement = document.querySelector('.app');
    if (appElement) {
      if (menuOpen) {
        appElement.classList.add('menu-open');
      } else {
        appElement.classList.remove('menu-open');
      }
    }
  }, [menuOpen]);

  const handleMenuLinkClick = () => {
    handleLinkClick();
    setMenuOpen(false);
  };

  return (
    <section className={`mobile__menu ${menuOpen ? 'menu-open' : ''}`}>
      <nav className="mobile__menu__nav">
        <ul>
          {mobileMenuItems.map((item) => (
            <li key={item.id} className="mobile__menu__item">
              <NavLink
                to={item.path}
                className={({ isActive }) => `mobile__menu__link ${isActive ? 'active' : ''}`}
                onClick={handleMenuLinkClick}
              >
                <span className="mobile__menu__link--text">
                  {item.icon && <item.icon className="icon" />}
                  {item.label}
                </span>
                <ChevronRight className="icon" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};


export default MobileMenu;