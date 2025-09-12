import React, { useState, useEffect } from 'react';
import './Header.css';
import { Search, Inbox } from '@mynaui/icons-react';
import ProfilePic from '../../assets/images/profile.png';
import Logo from "../../assets/images/logo.svg";
import MobileMenu from '../../layout/MobileMenu/MobileMenu';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

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

  return (
    <header className="header">
      <div className="header__left">
        <div className="header__search">
          <Search className="icon" />
          <input
            type="text"
            className="header__search-input"
            placeholder="Search anything..."
          />
        </div>
      </div>

      <div className="header__right">
        <div className="header__icon">
          <Inbox className="icon" />
        </div>
        <img src={ProfilePic} alt="Profile" className="header__profile" />
      </div>

      <div className="header__mobile">
        <a href="/" onClick={handleLinkClick}>
          <img src={Logo} alt="logo" />
        </a>
        <div className="header__menu" onClick={handleMenuClick}>
          <span></span>
          <span></span>
        </div>
      </div>

      <MobileMenu 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        handleLinkClick={handleLinkClick} 
      />
    </header>
  );
};

export default Header;