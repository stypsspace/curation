import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import client, { getAdvertEntries } from 'src/lib/contentful';
import Image from 'next/image';
import Head from 'next/head';

const contentfulLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

const ContentfulImage = (props) => {
  return <Image loader={contentfulLoader} alt={props.alt} {...props} />;
};

const Home = ({ combinedEntries }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFilterContainerVisible, setIsFilterContainerVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('.site-footer');
      const footerPosition = footer.getBoundingClientRect().top;
      const filterContainerWrap = document.querySelector('.filter-container-wrap');
    
      if (filterContainerWrap) {
        if (footerPosition <= window.innerHeight) {
          filterContainerWrap.classList.add('absolute');
        } else {
          filterContainerWrap.classList.remove('absolute');
        }
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
      {combinedEntries
    .sort((entry1, entry2) => {
      const creationTime1 = new Date(entry1.sys.createdAt).getTime();
      const creationTime2 = new Date(entry2.sys.createdAt).getTime();

      return creationTime2 - creationTime1; // Sort in descending order (latest first)
    })
    .map((entry) => {
      const { title, slug, coverImage, video, date, author, externalUrl, category } = entry.fields;

      // Check if it's an "Advert" entry
      if (entry.sys.contentType.sys.id === 'advert') {
        return (
          <li className='' key={slug}>
            {/* Rendering for "Advert" entries */}
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
              
              {/* Add video rendering for "Advert" entries here */}
              {video && (
              <div className='post-video'>
              <div className='video-wrapper'>
              <video
              id={`video-${slug}`}
              className='video-player'
              src={video.fields.file.url}
              width={400}
              height={300}
              autoPlay
              loop
              preload='metadata'
              muted
              playsInline
              ></video>
              </div>
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
              <div className='advert-title'>
                <h3>{title}</h3>
              </div>
              </a>
          </li>
        );
      } else {
        // It's a "Post" entry
        return (
          <li className='' key={slug}>
            {/* Rendering for "Post" entries */}
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
                      preload='metadata'
                      muted
                      playsInline
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
      }
    })}
</ul>




    </div>
  );
};

export async function getStaticProps() {
  const postResponse = await client.getEntries({
    content_type: 'post',
    order: '-sys.createdAt', // Sort by createdAt field in descending order (latest first)
  });

  const advertResponse = await getAdvertEntries();

  const posts = postResponse.items.map((post) => ({
    sys: post.sys,
    fields: post.fields,
  }));

  const adverts = advertResponse.map((advert) => ({
    sys: advert.sys,
    fields: advert.fields,
  }));

  // Combine "Post" and "Advert" entries into a single array
  const combinedEntries = [...posts, ...adverts];

  return {
    props: {
      combinedEntries,
    },
  };
}



export default Home;
