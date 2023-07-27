import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import client from 'src/lib/contentful';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const contentfulLoader = ({ src, width, quality }) => {
  const fileType = src.split('.').pop();
  if (fileType === 'mp4') {
    return src; // Return video URL directly
  }
  return `${src}?w=${width}&q=${quality || 75}`;
};

const ContentfulImage = (props) => {
  return <Image loader={contentfulLoader} {...props} />;
};

const Posts = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setSelectedCategory('');
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.fields.category === selectedCategory)
    : posts;

    return (
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
        <ul className='category-container'>
          {filteredPosts.map((post) => (
            <Post key={post.fields.slug} post={post} />
          ))}
        </ul>
      </div>
    );
  };

const Post = ({ post }) => {
  const { title, slug, coverImage, video, date, author, externalUrl } = post.fields;

  // Client-side rendering: Render the component once data is available
  return (
    <div className='posts-wrap'>
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
                  className='video-player'
                  url={video.fields.file.url} // Use the Contentful video URL
                  width={400}
                  height={300}
                  playing
                  loop
                  muted
                  controls={false}
                  playsInline // Use playsInline instead of playsinline
                  config={{
                    file: {
                      attributes: {
                        controlsList: 'nodownload', // Hide download option for the video
                      },
                    },
                  }}
                />
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
          <div className='author-name'>
            {author.fields.picture && (
              <ContentfulImage
                src={author.fields.picture.fields.file.url}
                layout='fixed'
                width={40}
                height={40}
                loading='lazy'
                className='fade-in'
                alt={author.fields.name}
              />
            )}
          </div>
          <div className='font-semibold'>{author.fields.name}</div>
        </div>
      </li>
    </div>
  );
};

export const getStaticProps = async () => {
  const response = await client.getEntries({ content_type: 'post' });

  const posts = response.items.map((post) => ({
    fields: {
      ...post.fields,
      externalUrl: post.fields.externalUrl || '',
      video: post.fields.video || null, // Add 'video' field with fallback value
    },
  }));

  return {
    props: {
      posts,
      revalidate: 60,
    },
  };
};

export default Posts;
