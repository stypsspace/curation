import Link from 'next/link'
import React from 'react'

const Layout = ({ children }) => {
return (
<div className="site-wrapper">

<header className='site-header'>
<nav className='site-header-nav-wrap'>

<ul className='site-header-nav'>
<li>
<Link
href='/'
className='text-sm font-medium uppercase text-stone-400'
>
Home
</Link>
</li>

<li>
<Link
href='/shop'
className='text-sm font-medium uppercase text-stone-400'
>
Shop
</Link>
</li>

<li>
<Link
href='/personal'
className='text-sm font-medium uppercase text-stone-400'
>
Personal
</Link>
</li>

<li>
<Link
href='/portfolio'
className='text-sm font-medium uppercase text-stone-400'>
Portfolio
</Link>
</li>
</ul>
</nav>
</header>

<main className='wrap'>{children}</main>

      <footer className='site-footer'>
        <div className='site-footer-content'>
          <p>Made by Styps</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
