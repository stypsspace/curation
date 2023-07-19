import Link from 'next/link'
import React from 'react'

const PageNotFound = () => {
  return (
    <section className='404-wrap'>
      <div className='404-container'>
        <h1 className='404-title'>404</h1>
        <h2>That page cannot be found!</h2>
        <div className='404-link-wrap'>
          <Link
            href='/'
            className='404-link'
          >
            Go Home
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PageNotFound
