import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RichText from 'src/components/ui/RichText';
import { createClient } from 'contentful';
import { useRouter } from 'next/router';
import { Redis } from '@upstash/redis';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});


const redis = new Redis({
  url: 'https://flowing-chipmunk-34813.upstash.io',
  token: 'AYf9ACQgZDUwMDE2ZTEtYmY3YS00MGYzLTk3YWYtMjhkYWI0ZDg4MWE0N2JhOGE3ODFmNGY3NGNmNDljZTQ5MmExNTA4MzBlM2Q=',
});

function contentfulLoader({ src, width, quality }) {
  const fileType = src.split('.').pop();
  if (fileType === 'mp4') {
    return src; // Return video URL directly
  }
  return `${src}?w=${width}&q=${quality || 75}`;
}

const ContentfulImage = (props) => {
  return <Image loader={contentfulLoader} {...props} />;
};

const API_URL = 'pages/api/incr';



const fetchViewCountFromRedis = async (slug) => {
  try {
    const viewCount = await redis.get(slug);
    return viewCount ? parseInt(viewCount, 10) : 0;
  } catch (error) {
    console.error('Error fetching view count from Redis:', error);
    return 0;
  }
};



const fetchViewCountFromAPI = async (slug) => {
  try {
    const response = await fetch('/api/incr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug }),
    });

    if (!response.ok) {
      throw new Error('Error incrementing view count.');
    }

    const textData = await response.text();

    // Check if the response is empty or not valid JSON
    if (!textData) {
      throw new Error('Empty or invalid response data from API.');
    }

    const data = JSON.parse(textData);

    console.log('Parsed JSON data:', data);

    if (data && typeof data.viewCount === 'number') {
      return data.viewCount;
    } else {
      throw new Error('Invalid response data from API.');
    }
  } catch (error) {
    console.error('Error fetching view count from API:', error);
    return 0;
  }
};

const fetchViewCount = async (slug) => {
  const viewCountFromRedis = await fetchViewCountFromRedis(slug);
  const viewCountFromAPI = await fetchViewCountFromAPI(slug);
  return Math.max(viewCountFromRedis, viewCountFromAPI);
};

const Post = ({ post, relatedPosts }) => {
  // Ensure the post prop is not undefined
  if (!post) {
    return <div>Loading...</div>;
  }

  const { content, name, externalUrl } = post.fields;
  const router = useRouter();

  // State to store the view count
  const [viewCount, setViewCount] = useState(0);

  // Function to fetch the view count for the post
  const fetchViewCountForPost = async () => {
    try {
      console.log('Fetching view count...');
      const slug = post.fields.slug;
      const viewCount = await fetchViewCount(slug);
      console.log('Received view count:', viewCount);
      setViewCount(viewCount);
    } catch (error) {
      console.error('Error fetching view count:', error);
    }
  };

  // Fetch the view count when the component mounts
  useEffect(() => {
    fetchViewCountForPost();
  }, []);

  // Client-side rendering: Render the component once data is available
  return (
    <div className='post-single-wrap'>
      <div className='fade-in'>
        <div className="site-description">
          <p>{post.fields.title}</p>
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

        {/* Display the view count from Redis */}
        <div className='view-count'>
          Views from Redis: {viewCount}
        </div>

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
    fallback: true, // Set to true to enable fallback for unfetched pages
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

  return {
    props: {
      post: {
        fields: {
          ...post.fields,
          externalUrl: post.fields.externalUrl || '',
        },
      },
      relatedPosts: limitedRelatedPosts,
    },
  };
};

export default Post;
