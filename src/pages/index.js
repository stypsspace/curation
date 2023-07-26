import React, { useState } from 'react';
import Link from 'next/link';
import client from 'src/lib/contentful';
import Image from 'next/image';

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

  return (
    <div className='posts-wrap'>
      <li className='fade-in' key={slug}>
        <div className="post-header">
          <h3>{title}</h3>
          <span className='post-externalurl'>
            {externalUrl && (
              <a href={externalUrl} target="_blank" rel="noopener noreferrer">
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
            <video
              src={video.fields.file.url}
              controls // Add controls to show video player controls
              width={400}
              height={300}
              autoPlay // Optional: Add autoPlay attribute if you want the video to start playing automatically
              muted // Optional: Add muted attribute if you want the video to be muted by default
              loop // Optional: Add loop attribute if you want the video to loop
              loading='lazy'
            >
              Your browser does not support the video tag.
            </video>
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
              className='fade-in'
              alt={author.fields.name}
            />
          </div>
          <div className='author-name'>{author.fields.name}</div>
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
