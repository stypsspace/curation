import React, { useState } from 'react';
import Link from 'next/link';

const MenuToggle = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showIndexMenu, setShowIndexMenu] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setShowIndexMenu(false);
    setShowInfoMenu(false);
  };

  const openIndexMenu = () => {
    setShowIndexMenu(true);
    setShowInfoMenu(false);
  };

  const openInfoMenu = () => {
    setShowIndexMenu(false);
    setShowInfoMenu(true);
  };

  return (
    <div>
      <nav className={`site-header-nav-wrap ${isMenuOpen ? 'hidden' : ''}`}>
        <div className='site-header-nav'>
          <div className='styps-logo'>
            <Link href="/" className="site-header-logo">
              <img src="/logo.png" alt="Logo" width={400} height={400} />
            </Link>
          </div>
          <span className='open-site-header-menu' onClick={openMenu}>. . .</span>
        </div>
      </nav>

      <div className={`site-header-menu ${isMenuOpen ? 'open' : 'hidden'}`}>
        <ul className='site-header-menu-content'>
          <li className='site-header-menu-content-button-1' onClick={openIndexMenu}>
            Index
          </li>
          <li className='site-header-menu-content-button-2' onClick={openInfoMenu}>
            Info
          </li>
          <li className='site-header-menu-content-button-3'>
            <Link href='/shop' className=''>Shop</Link>
          </li>
        </ul>
        {isMenuOpen && (
          <span className='close-site-header-menu' onClick={closeMenu}>Close</span>
        )}
      </div>



      <div className={`site-header-inner-menu ${showIndexMenu || showInfoMenu ? 'open' : ''}`}>


{/* Index menu */}
{showIndexMenu && (
        <div className='site-header-index-menu'>

          <div className='site-header-index-menu-header'>
            <h3 className='site-header-index-menu-header-title'>Index</h3>
             <span className='close-site-header-index-menu' onClick={() => setShowIndexMenu(false)}>Close</span>
          </div>

          <ul className='site-header-index-menu-content'>
            <li className='site-header-index-menu-content-button-1'> 
              <Link href='/personal' className=''>Personal</Link>
            </li>   
            <li className='site-header-index-menu-content-button-1'> 
              <Link href='/portfolio' className=''>Portfolio</Link>
            </li> 
            <li className='site-header-index-menu-content-button-1'> 
              <Link href='/agency' className=''>Agency</Link>
            </li> 
            <li className='site-header-index-menu-content-button-1'> 
              <Link href='/studio' className=''>Studio</Link>
            </li> 
            <li className='site-header-index-menu-content-button-1'> 
              <Link href='/e-commerce' className=''>E-Commerce</Link>
            </li> 
            <li className='site-header-index-menu-content-button-1'> 
              <Link href='/technology' className=''>Tech</Link>
            </li> 
          </ul>
        </div>
        )}
     
{/* Info menu */}
{showInfoMenu && (

      <div className={`site-header-info-menu ${showInfoMenu ? 'open' : ''}`}>
        
        <div className='site-header-info-menu-header'>
          <h3 className='site-header-info-menu-header-title'>Info</h3>
          <span className='close-site-header-info-menu' onClick={() => setShowInfoMenu(false)}>Close</span>
        </div>

        <ul className='site-header-info-menu-content'>
          {/* Info menu content items */}
          <li className='site-header-info-menu-content-button-1'> 
            <Link href='/profile' className=''>Profile</Link>
          </li>   
          <li className='site-header-info-menu-content-button-1'> 
            <Link href='/social' className=''>Social</Link>
          </li> 
          <li className='site-header-info-menu-content-button-1'> 
            <Link href='/shop' className=''>Submission</Link>
          </li> 
          <li className='site-header-info-menu-content-button-1'> 
            <Link href='/shop' className=''>Sponsor</Link>
          </li> 
          <li className='site-header-info-menu-content-button-1'> 
            <Link href='/shop' className=''>Advertise</Link>
          </li> 
          <li className='site-header-info-menu-content-button-1'> 
            <Link href='/shop' className=''>Legal</Link>
          </li> 
        </ul>
      </div>
      )}

    </div>
    </div>
  );
};

export default MenuToggle;
