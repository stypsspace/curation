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

const Portfolio = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return (
      <div>
        <h3 className='page-title'>Portfolio</h3>
        <p>No entries found.</p>
      </div>
    );
  }

    // Sort the entries by createdAt date in descending order
    const sortedEntries = entries.sort((entry1, entry2) => {
      const creationTime1 = new Date(entry1.sys.createdAt).getTime();
      const creationTime2 = new Date(entry2.sys.createdAt).getTime();
  
      return creationTime2 - creationTime1; // Sort in descending order (latest first)
    });

  return (
    <div>
      <h3 className='page-title'>Portfolio</h3>
      <ul className='category-container'>

       {sortedEntries.map((entry) => {
          const { sys, fields } = entry;
          const { title, slug, coverImage, video, date, author, externalUrl } = fields;

          if (sys.contentType.sys.id === 'post') {
            // It's a "Post" entry
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
          } else if (sys.contentType.sys.id === 'advert') {
            // It's an "Advert" entry
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
          }
          return null; // Skip other types of entries
        })}
      </ul>
    </div>
  );
};

export async function getStaticProps() {
  try {
    // Fetch "Post" entries with the 'Portfolio' category
    const postResponse = await client.getEntries({
      content_type: 'post',
      'fields.category': 'Portfolio',
    });

    // Fetch "Advert" entries with the 'Portfolio' category
    const advertResponse = await client.getEntries({
      content_type: 'advert',
      'fields.category': 'Portfolio',
    });

    // Combine the results
    const posts = postResponse.items.map((post) => ({
      sys: post.sys,
      fields: post.fields,
    }));

    const advertItems = advertResponse.items.map((advert) => ({
      sys: advert.sys,
      fields: advert.fields,
    }));

    const combinedEntries = [...posts, ...advertItems];

    return {
      props: {
        entries: combinedEntries,
      },
    };
  } catch (error) {
    console.error('Error fetching entries:', error);
    return {
      props: {
        entries: [],
      },
    };
  }
}

export default Portfolio;
