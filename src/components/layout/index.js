import Link from 'next/link';
import React from 'react';

const Layout = ({ children }) => {
return (

 

<div className="site-wrapper">

<header className='site-header'>


<nav className='site-header-nav-wrap'>

<ul className='site-header-nav'>

<li>
<div className='styps-logo'>
<Link href='/' className='site-header-logo'>
<img src='logo.png' alt='Logo'/>
</Link>
</div>
</li>

<li>
<span className='site-header-nav-link-1'>
Index
</span>
</li>

<li>
<span className='site-header-nav-link-2'>
Menu
</span>
</li>
</ul>
</nav>
</header>

<main className='wrap'>{children}</main>

<footer className='site-footer'>
<div className='site-footer-content'>
<p>©2023 Styps Ltd</p>
</div>
</footer>

</div>
);
};

export default Layout;
