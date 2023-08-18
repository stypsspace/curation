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
<div className='site-header-nav'>

<div className='styps-logo'>
<Link href="/" className="site-header-logo">
<img src="/logo.png" alt="Logo" width={400} height={400} />
</Link>
</div>
<span className='open-site-header-menu'>. . .</span>

</div>
</nav>



<div className='site-header-menu'>
<ul className='site-header-menu-content'>
    <li className='site-header-menu-content-button-1'>Index</li>
    <li className='site-header-menu-content-button-2'>Info</li>
    <li className='site-header-menu-content-button-3'>
    <Link href='/shop' className=''>Shop</Link>
    </li>
</ul> 

<span className='close-site-header-menu'>Close</span>
</div> {/* Site header menu */}


<div className='site-header-inner-menu'>

<div className='site-header-index-menu'>
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
</div> {/* Site header index menu */}



<div className='site-header-info-menu'>
<ul className='site-header-info-menu-content'>

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
</div> {/* Site header info menu */}


</div> {/* Site header inner menu */}



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
<div className='site-footer-nav-help'>Help</div>
<div className='site-footer-nav-social'>Social</div>
<div className='site-footer-nav-copyright'>©2023</div>
</div>

</div>
</footer>
</div>

);
};

export default Layout;
