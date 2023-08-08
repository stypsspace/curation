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



const Post = ({ post, relatedPosts, initialPageViews }) => {
  const { content, name, externalUrl } = post.fields;
  const slug = post.fields.slug;

  // Define the pageViews state variable
  const [pageViews, setPageViews] = useState(initialPageViews);

  useEffect(() => {
    // Fetch page views from your server-side API
    const fetchPageViews = async () => {
      try {
        const response = await fetch(`/api/views/${slug}`, {
          method: 'PATCH', // Assuming this triggers an increment in the API
        });
        const data = await response.json();
        setPageViews(data.views);
      } catch (error) {
        console.error('Error fetching page views:', error);
      }
    };

    fetchPageViews();
  }, [slug]);


  // Client-side rendering: Render the component once data is available
  return (
    <div className='post-single-wrap'>
      <div className=''>

      <div className="single-site-description">
          <p>
          
            </p>
            </div>

        <div className='post-single-header'>
          <div className='post-single-pageviews'>{pageViews} views</div>
          <span className='post-single-externalurl'>
            {externalUrl && (
              <a href={externalUrl} target='_blank' rel='noopener noreferrer' className='mt-4 text-blue-500 underline'>
                Open
              </a>
            )}
          </span>
        </div>

       
           
            
             
           
         

        <a href={externalUrl} target='_blank' rel='noopener noreferrer' className='mt-4 text-blue-500 underline'>
                
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
 </a>
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
        <h3 className='post-single-content-title'>{post.fields.title}</h3>
        <div className='post-single-paragraph'><RichText content={content} /></div>
        </div>

         {/* Display the updated page view count */}
         

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
      url: 'https://smashing-ram-39118.upstash.io',
      token: 'AZjOACQgNmVjNGJmMTYtZTNkZC00YjcyLWE4ZDUtZjQ4NGVkMzI4ZTA0OTYyOWEyMGZlMDNjNDM3YWIwZGRlNzNlNDM0ODczYjY=',
    });

    const views = await redis.get(["pageviews", "projects", post.fields.slug].join(":"));
    const initialPageViews = views || 0;

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