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
  const [videoThumbnails, setVideoThumbnails] = useState({});

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Fetch video thumbnails from the serverless function
  useEffect(() => {
    const fetchThumbnails = async () => {
      const videoThumbnails = {};
      for (const post of posts) {
        if (post.fields.video) {
          try {
            const response = await fetch('/api/generateThumbnail', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ videoUrl: post.fields.video.fields.file.url }),
            });
            const data = await response.json();
            videoThumbnails[post.fields.slug] = data.thumbnail;
          } catch (error) {
            console.error('Error fetching video thumbnail:', error);
          }
        }
      }
      setVideoThumbnails(videoThumbnails);
    };

    fetchThumbnails();
  }, [posts]);

  // Filter posts based on the selected category
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.fields.category === selectedCategory)
    : posts;

  useEffect(() => {
    const setVideoPosters = async () => {
      const videoElements = document.querySelectorAll('.video-player');

      for (const video of videoElements) {
        try {
          const thumbnail = await generateThumbnail(video.src, { width: 400, height: 300 });
          video.poster = thumbnail;
        } catch (error) {
          console.error('Error generating video thumbnail:', error);
        }
      }
    };

    setVideoPosters();
  }, []);

  return (
    <div>
      <div className='filter-container-wrap'>
        <ul className='filter-container'>
          {/* ... Filter buttons code ... */}
        </ul>
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
