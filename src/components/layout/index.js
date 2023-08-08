import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Layout = ({ children }) => {
const [klaviyoFormLoaded, setKlaviyoFormLoaded] = useState(false);

useEffect(() => {
setKlaviyoFormLoaded(true);
}, []);

return (

<div className="site-wrapper">

<header className='site-header'>


<nav className='site-header-nav-wrap'>

<ul className='site-header-nav'>

<li>
<div className='styps-logo'>
<Link href="/" className="site-header-logo">
<img src="/logo.png" alt="Logo" width={400} height={400} />
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
<div className='subscribe-box'>
<h3 className='subscribe-title'></h3>
<div className='subscribe-form'>
{klaviyoFormLoaded && (
<div className="klaviyo-form-UeNcKv"></div>
)}
<h3></h3>
</div>
</div>
</div>
</footer>
</div>
);
};

export default Layout;
