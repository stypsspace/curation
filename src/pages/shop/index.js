import React, { useState } from 'react';
import Link from 'next/link';
import client from 'src/lib/contentful';
import Image from 'next/image';
import Head from 'next/head';

const contentfulLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

const ContentfulImage = (props) => {
  return <Image loader={contentfulLoader} alt={props.alt} {...props} />;
};

const Shop = ({ shopEntries }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Filter shop entries based on the selected category
  const filteredShopEntries = selectedCategory
    ? shopEntries.filter((entry) => entry.fields.category === selectedCategory)
    : shopEntries;

  // Sort shop entries in descending order by creation time
  const sortedShopEntries = filteredShopEntries.sort((entry1, entry2) => {
    const creationTime1 = new Date(entry1.sys.createdAt).getTime();
    const creationTime2 = new Date(entry2.sys.createdAt).getTime();
    return creationTime2 - creationTime1; // Sort in descending order (latest first)
  });

  return (
    <div>
        <Head>
        <title>Styps — Curated websites for inspiration and promotion of good design</title>
      </Head>

      <div className='site-description'>
        <p>Curated marketplace of high quality Framer and Webflow templates and components</p>
      </div>

      {/* Add category filtering buttons similar to the "Posts" page */}
      <div className='filter-container-wrap'>
        <ul className='filter-container'>
          <li>
            <button onClick={() => handleCategoryChange('')}>All</button>
          </li>
          <li>
            <button onClick={() => handleCategoryChange('Category1')}>Category1</button>
          </li>
          {/* Add more category buttons as needed */}
        </ul>
      </div>

      {/* Render the sorted shop entries */}
      <ul className='shop-container'>
        {sortedShopEntries.map((entry) => {
          const { title, slug, image, video, price } = entry.fields;
          return (
            <li className='fade-in' key={slug}>
              
              <div className='shop-image'>
                <Link href={`/shop/${slug}`} aria-label={title}>
                  {video ? (
                    <div className='video-wrapper'>
                      <video
                        className='video-player'
                        src={video.fields.file.url}
                        width={400}
                        height={300}
                        autoPlay
                        loop
                        preload='metadata'
                        muted
                        playsInline
                      />
                    </div>
                  ) : (
                    image && image.fields && image.fields.file && (
                      <ContentfulImage
                        alt={`Image for ${title}`}
                        src={image.fields.file.url}
                        width={400}
                        height={300}
                        loading='lazy'
                      />
                    )
                  )}
                </Link>
              </div>
              <div className='shop-header'>
                <h3>{title}</h3>
                <div className='shop-price'>{price}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export async function getStaticProps() {
  const response = await client.getEntries({ content_type: 'shop' });

  const shopEntries = response.items.map((entry) => ({
    sys: entry.sys,
    fields: entry.fields,
  }));

  return {
    props: {
      shopEntries,
    },
  };
}

export default Shop;
