import React, { useState, useEffect } from 'react';
import Link from 'next/link';
//import client from 'src/lib/contentful'; // Import only the client object
import client, { getAdvertEntries } from 'src/lib/contentful';
import Image from 'next/image';
import Head from 'next/head';


const contentfulLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

const ContentfulImage = (props) => {
  return <Image loader={contentfulLoader} alt={props.alt} {...props} />;
};


const Posts = ({ posts, adverts }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFilterContainerVisible, setIsFilterContainerVisible] = useState(false);




  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('.site-footer');
      const footerPosition = footer.getBoundingClientRect().top;
      const filterContainerWrap = document.querySelector('.filter-container-wrap');
  
      if (footerPosition <= window.innerHeight) {
        filterContainerWrap.classList.add('absolute');
      } else {
        filterContainerWrap.classList.remove('absolute');
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  
  
  
  
  




  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };


  const toggleFilterContainer = () => {
    setIsFilterContainerVisible((prevState) => !prevState);
  };

  // Filter posts based on the selected category
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.fields.category === selectedCategory)
    : posts;



  return (
    <div>
      <Head>
        <title>Styps — Curated websites for inspiration and promotion of good design</title>
      </Head>

    
      <div className='site-description'>
        <p>Curated websites for inspiration and promotion of good design</p>
      </div>

     {/* Display "Post" and "Advert" entries */}
<ul className='category-container'>
  {filteredPosts.concat(adverts)
  
  .sort((entry1, entry2) => {
    // Determine the correct date field for each entry type
    const date1 = entry1.fields.date || entry1.fields.startDate;
    const date2 = entry2.fields.date || entry2.fields.startDate;
    // Sort entries in descending order based on their publication date
    return new Date(date2) - new Date(date1);
  })
    .map((entry) => {
      if (entry.fields.category) {
        // This is a "Post" entry
        const { title, slug, coverImage, video, date, author, externalUrl } = entry.fields;
        return (
          <li className='' key={slug}>
            <div className='post-image'>
              <Link href={`/posts/${slug}`} aria-label={title}>
                {coverImage && coverImage.fields && coverImage.fields.file && (
                  <ContentfulImage
                    alt={`Cover Image for ${title}`}
                    src={coverImage.fields.file.url}
                    width={400}
                    height={300}
                    loading='lazy'
                  />
                )}
              </Link>
            </div>
            {video && (
              <div className='post-video'>
                <Link href={`/posts/${slug}`} aria-label={title}>
                  <div className='video-wrapper'>
                    <video
                      id={`video-${slug}`}
                      className='video-player'
                      src={video.fields.file.url}
                      width={400}
                      height={300}
                      autoPlay
                      loop
                      preload='metadata' // Preload only the metadata for faster loading
                      muted // Mute the video to prevent audio playback on page load
                      playsInline // Add playsInline attribute to prevent picture-in-picture on mobile
                    ></video>
                  </div>
                </Link>
              </div>
            )}
           <div className='post-date'>
            {date && (
            <time dateTime={new Date(date).toISOString().slice(0, 10)}>
              {new Date(date).toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </time>
            )}
            </div>

          
            <div className='author-name-wrap'>
            {author && author.fields && author.fields.picture && author.fields.picture.fields && (
            <div className='author-name-image'>
            <ContentfulImage
            src={author.fields.picture.fields.file.url}
            layout='fixed'
            width={40}
            height={40}
            loading='lazy'
            className='author-name'
            alt={author.fields.name}
            />
            </div>
            )}
            {author && author.fields && author.fields.name && (
            <div className='author-name'>{author.fields.name}</div>
            )}
            </div>

            <div className='post-header'>
              <h3>{title}</h3>
            </div>
          </li>

        );
      } else {
        // This is an "Advert" entry
        const { title, slug, coverImage, externalUrl, startDate, endDate } = entry.fields;
        return (
          <li className='' key={slug}>
            {externalUrl && (
              <a href={externalUrl} target="_blank" rel="noopener noreferrer">
                <button className='advert-button'>Ad</button>
                <div className='advert-image'>
                  {coverImage && coverImage.fields && coverImage.fields.file && (
                    <ContentfulImage
                      alt={`Cover Image for ${title}`}
                      src={coverImage.fields.file.url}
                      width={400}
                      height={300}
                      loading='lazy'
                    />
                  )}
                </div>
              
              </a>
            )}
            <div className='post-date'>
            {entry.fields.date && (
            <time dateTime={new Date(entry.fields.date).toISOString().slice(0, 10)}>
            {new Date(entry.fields.date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            })}
            </time>
            )}
            </div>

            <div className='advert-title'>
              <h3>{title}</h3>
            </div>
           
          </li>

        );
      }
    })}
</ul>






      <div className='open-filter-container'></div>

      <div className='filter-container-wrap'>
      <div className='filter-container-header' onClick={toggleFilterContainer}>
        <div className='filter-container-header-title'>Filter</div>

        {isFilterContainerVisible ? (
          <div className='filter-container-header-minusicon'></div>
        ) : (
          <div className='filter-container-header-plusicon'></div>
        )}
      </div>
      
      {isFilterContainerVisible && (
        <ul className='filter-container'>
            <li>
            <button onClick={() => handleCategoryChange('')}>All</button>
          </li>
          <li>
            <button onClick={() => handleCategoryChange('Portfolio')}>Portfolio</button>
          </li>
          <li>
            <button onClick={() => handleCategoryChange('Personal')}>Personal</button>
          </li>
          <li>
            <button onClick={() => handleCategoryChange('App')}>App</button>
          </li>
          <li>
            <button onClick={() => handleCategoryChange('Commerce')}>Commerce</button>
          </li>
          <li>
            <button onClick={() => handleCategoryChange('Technology')}>Technology</button>
          </li>
        </ul>
      )}
    </div>




    </div>
  );
};

export async function getStaticProps() {
  const postResponse = await client.getEntries({ content_type: 'post' });
  const advertResponse = await getAdvertEntries(); // Use the function we defined

  const posts = postResponse.items.map((post) => ({
    sys: post.sys,
    fields: post.fields,
  }));

  const adverts = advertResponse.map((advert) => ({
    sys: advert.sys,
    fields: advert.fields,
  }));

  return {
    props: {
      posts,
      adverts,
    },
  };
}

export default Posts;
