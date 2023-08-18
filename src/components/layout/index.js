import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import MenuToggle from 'src/components/MenuToggle'; // Import the MenuToggle component


const Layout = ({ children }) => {
const [klaviyoFormLoaded, setKlaviyoFormLoaded] = useState(false);


useEffect(() => {
setKlaviyoFormLoaded(true);
}, []);




return (

<div className="site-wrapper">

<header className='site-header'>

<MenuToggle /> {/* Use the MenuToggle component */}

</header>





<main className='wrap'>{children}</main>

<footer className='site-footer'>

<div className='site-footer-inner'>
<div className='site-footer-content'>

<div className='subscribe-box'>
<p className='subscribe-top'>Best websites in your inbox</p>
<p className='subscribe-bottom'>No spam</p>
<div className='subscribe-form'>
{klaviyoFormLoaded && (
<div className="klaviyo-form-UeNcKv"></div>
)}
</div>
</div>
</div>

<div className='site-footer-nav'>
<div className='site-footer-nav-copyright'>©2023 Styps</div>
</div>

</div>
</footer>
</div>

);
};

export default Layout;
