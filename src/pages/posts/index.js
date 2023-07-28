import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import client from 'src/lib/contentful';
import Image from 'next/image';

const contentfulLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

const ContentfulImage = (props) => {
  return <Image loader={contentfulLoader} {...props} />;
};

const Posts = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Filter posts based on the selected category
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.fields.category === selectedCategory)
    : posts;

  return (
    <div>
      <div className='filter-container-wrap'>
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
      </div>

      <div className="site-description">
          <p>Curated websites for inspiration and promotion of good design
            </p>
            </div>

      <ul className='category-container'>
        {filteredPosts.map((post) => {
          const { title, slug, coverImage, video, date, author, externalUrl } = post.fields;
          return (
            <li className='fade-in' key={slug}>
              <div className='post-header'>
                <h3>{title}</h3>
                <span className='post-externalurl'>
                  {externalUrl && (
                    <a href={externalUrl} target='_blank' rel='noopener noreferrer'>
                      <button>Open</button>
                    </a>
                  )}
                </span>
              </div>
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
                      >
                      </video>
                    </div>
                  </Link>
                </div>
              )}

              <div className='post-date'>
                <time dateTime={new Date(date).toISOString().slice(0, 10)}>
                  {new Date(date).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </time>
              </div>

              <div className='author-name-wrap'>
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
                <div className='author-name'>{author.fields.name}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export async function getStaticProps() {
  const response = await client.getEntries({ content_type: 'post' });

  const posts = response.items.map((post) => ({
    sys: post.sys,
    fields: post.fields,
  }));

  return {
    props: {
      posts,
    },
  };
}

export default Posts;
