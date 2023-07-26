import React from 'react';
import Link from 'next/link';
import client from 'src/lib/contentful';
import Image from 'next/image';

const contentfulLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

const ContentfulImage = (props) => {
  return <Image loader={contentfulLoader} {...props} />;
};

const Portfolio = ({ posts }) => {
  return (
    <div>
      <h3 className='page-title'>Portfolio</h3>
      <ul className='category-container'>
        {posts.map((post) => {
          const { title, slug, coverImage, video, date, author, externalUrl } = post.fields;
          return (
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
                  <Link href={`/posts/${slug}`} aria-label={title}> {/* Move the Link component here */}
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
                    >
                      Your browser does not support the video tag.
                    </video>
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
  const response = await client.getEntries({
    content_type: 'post',
    'fields.category': 'Portfolio',
  });

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

export default Portfolio;
