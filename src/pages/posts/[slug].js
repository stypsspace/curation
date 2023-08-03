import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RichText from 'src/components/ui/RichText';
import { createClient } from 'contentful';
import { Redis } from '@upstash/redis';



const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

function contentfulLoader({ src, width, quality }) {
  const fileType = src.split('.').pop();
  if (fileType === 'mp4') {
    return src; // Return video URL directly
  }
  return `${src}?w=${width}&q=${quality || 75}`;
}

const ContentfulImage = (props) => {
  return <Image loader={contentfulLoader} alt={props.alt} {...props} />;
};



const redis = new Redis({
  url: 'https://suitable-bull-37897.upstash.io',
  token: 'AZQJACQgODYyNGJmODAtODVmZi00Y2YyLThlNTUtNWZmZDAyZDdmMGZlNjA1ZTViYzYzNWQzNDBmM2I4MzNjODMyODliYjMzZDY=',
})
   
const data = await redis.set('foo', 'bar');

const Post = ({ post, relatedPosts, initialPageViews }) => {
  const { content, name, externalUrl } = post.fields;

  // Define the pageViews state variable
  const [pageViews, setPageViews] = useState(initialPageViews);

  useEffect(() => {
    console.log('useEffect is running');
  
    const fetchPageViews = async () => {
      try {
        // Initialize a new Redis client for this specific fetch
        const redisClient = new Redis({
          url: 'https://suitable-bull-37897.upstash.io',
          token: 'AZQJACQgODYyNGJmODAtODVmZi00Y2YyLThlNTUtNWZmZDAyZDdmMGZlNjA1ZTViYzYzNWQzNDBmM2I4MzNjODMyODliYjMzZDY=',
        });
  
        const views = await redisClient.get(["pageviews", "projects", post.fields.slug].join(":"));
        setPageViews(views ?? 0);
  
        // Close the Redis connection
        await redisClient.quit();
      } catch (error) {
        console.error('Error fetching page views from Redis:', error);
      }
    };
  
    fetchPageViews();
  }, [post.fields.slug]);


  // Client-side rendering: Render the component once data is available
  return (
    <div className='post-single-wrap'>
      <div className='fade-in'>

      <div className="site-description">
          <p>
          {post.fields.title}
            </p>
            </div>

        <div className='post-single-header'>
          <h3>{post.fields.title}</h3>
          <span className='post-single-externalurl'>
            {externalUrl && (
              <a href={externalUrl} target='_blank' rel='noopener noreferrer' className='mt-4 text-blue-500 underline'>
                Open
              </a>
            )}
          </span>
        </div>

        <div className='post-single-image'>
          {post.fields.coverImage?.fields?.file && (
            <ContentfulImage
              alt={`Cover Image for ${post.fields.title}`}
              src={post.fields.coverImage.fields.file.url}
              width={400}
              height={300}
              loading='lazy'
            />
          )}
        </div>

        {post.fields.video && (
          <div className='post-single-video'>
            <div className='video-wrapper'>
              <video
                className='video-player'
                src={post.fields.video.fields.file.url}
                width={400}
                height={300}
                autoPlay
                loop
                controls={false}
                muted
                playsInline
              >
              </video>
            </div>
          </div>
        )}

        <div className='post-date'>
          <time dateTime={new Date(post.fields.date).toISOString().slice(0, 10)}>
            {new Date(post.fields.date).toLocaleDateString('en-US', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </time>
        </div>

        <div className='author-name-wrap'>
          <div className='author-name'>
            {post.fields.author?.fields?.picture?.fields?.file && (
              <ContentfulImage
                src={post.fields.author.fields.picture.fields.file.url}
                layout='fixed'
                width={40}
                height={40}
                loading='lazy'
                className='fade-in'
                alt={post.fields.author.fields.name}
              />
            )}
          </div>
          <div className='font-semibold'>{name}</div>
        </div>

        <div className='post-single-content'>
          <RichText content={content} />
        </div>

         {/* Display the updated page view count */}
         <p>{pageViews} views</p>

        {/* Display related posts */}
        <div className='related-posts-wrap'>
          <h3 className='related-posts-title'>Related Posts</h3>

          <ul className='related-posts-content'>
            {relatedPosts.map((relatedPost) => (
              <li key={relatedPost.fields.slug}>
                <div className='related-posts-header'>
                  <Link href={`/posts/${relatedPost.fields.slug}`}>
                    {relatedPost.fields.title}
                  </Link>

                  {/* Check if externalUrl exists in the related post */}
                  {relatedPost.fields.externalUrl && (
                    <span className='related-posts-externalurl'>
                      <a href={relatedPost.fields.externalUrl} target='_blank' rel='noopener noreferrer'>
                        <button>Open</button>
                      </a>
                    </span>
                  )}
                </div>

                {/* Check if the related post has a video */}
                <Link href={`/posts/${relatedPost.fields.slug}`}>
                  {relatedPost.fields.video && (
                    <div className='related-post-video'>
                      <video
                        className='video-player'
                        src={relatedPost.fields.video.fields.file.url}
                        width={200}
                        height={150}
                        autoPlay
                        loop
                        controls={false}
                        muted
                        playsInline
                      >
                      </video>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};

export const getStaticPaths = async () => {
  const response = await client.getEntries({ content_type: 'post' });

  const paths = response.items.map((post) => ({
    params: { slug: post.fields.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const response = await client.getEntries({
    content_type: 'post',
    'fields.slug': params.slug,
    limit: 1,
  });

  const post = response.items[0];

  // Fetch all posts with the same category
  const allPostsResponse = await client.getEntries({
    content_type: 'post',
    'fields.category': post.fields.category, // Replace 'category' with the actual field name for the category
  });

  // Filter only the posts that have a 'video' field
  const relatedPosts = allPostsResponse.items.filter((item) => item.fields.video);

  // Remove the current post from the related posts array
  const filteredRelatedPosts = relatedPosts.filter((item) => item.sys.id !== post.sys.id);

  // Limit the number of related posts to 5
  const limitedRelatedPosts = filteredRelatedPosts.slice(0, 5);

  try {
    const redis = new Redis({
      url: 'https://suitable-bull-37897.upstash.io',
      token: 'AZQJACQgODYyNGJmODAtODVmZi00Y2YyLThlNTUtNWZmZDAyZDdmMGZlNjA1ZTViYzYzNWQzNDBmM2I4MzNjODMyODliYjMzZDY=',
    });

    const views = await redis.get(["pageviews", "projects", post.fields.slug].join(":"));
    const initialPageViews = views ?? 0;

    return {
      props: {
        post: {
          fields: {
            ...post.fields,
            externalUrl: post.fields.externalUrl || '',
          },
        },
        relatedPosts: limitedRelatedPosts,
        initialPageViews,
      },
    };
  } catch (error) {
    console.error('Error fetching initial page views:', error);

    return {
      props: {
        post: {
          fields: {
            ...post.fields,
            externalUrl: post.fields.externalUrl || '',
          },
        },
        relatedPosts: limitedRelatedPosts,
        initialPageViews: 0,
      },
    };
  }
};

export default Post;
