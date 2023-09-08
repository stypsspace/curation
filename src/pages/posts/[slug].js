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


// Sort the relatedPosts array by createdAt date in descending order
const sortedRelatedPosts = relatedPosts.sort((post1, post2) => {
  const creationTime1 = new Date(post1.sys.createdAt).getTime();
  const creationTime2 = new Date(post2.sys.createdAt).getTime();
  
  return creationTime2 - creationTime1; // Sort in descending order (latest first)
  });


// Client-side rendering: Render the component once data is available
const renderPostContent = (initialPageViews, post) => {
const { content } = post.fields; // Extract the content property from the post object

return (
/* ... Existing code ... */
<div className='post-single-wrap'>
<div className=''>
<div className='single-site-description'>
<div className='single-site-description-content'>{post.fields.title}</div>
</div>

<a href={post.fields.externalUrl} target='_blank' rel='noopener noreferrer' className='mt-4 text-blue-500 underline'>
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
<div className='font-semibold'>{post.fields.name}</div>
</div>

<div className='post-single-content'>
<div className='post-single-header'>
<div className="post-single-paragraph-pageviews">{pageViews}  views </div>
<span className='post-single-externalurl'>
{post.fields.externalUrl && (
<a href={post.fields.externalUrl} target='_blank' rel='noopener noreferrer' className='mt-4 text-blue-500 underline'>
View
</a>
)}
</span>
</div>

<div className='post-single-paragraph'>
<RichText content={content} />
</div>
<div className="back-home">
<Link   href="/">Back</Link>
</div>

</div>
</div>
</div>
);
};

// Render related posts
const renderRelatedPosts = () => {
return (
<div className='related-posts-wrap'>
<h3 className='related-posts-title'>Related Posts</h3>
<ul className='related-posts-content'>

{sortedRelatedPosts.map((relatedPost) => (
<li key={relatedPost.sys.id}>
<div className={`related-posts-header ${relatedPost.type.toLowerCase()}`}>



{/* Add rendering for "Post" entries here */}
{relatedPost.type === 'Post' && (

<Link href={`/posts/${relatedPost.fields.slug}`} aria-label={relatedPost.fields.title}>
<div className='post-image'>
{relatedPost.fields.coverImage?.fields?.file && (
<ContentfulImage
alt={`Cover Image for ${relatedPost.fields.title}`}
src={relatedPost.fields.coverImage.fields.file.url}
width={400}
height={300}
loading='lazy'
/>
)}
</div>


{relatedPost.fields.video && (
<div className='post-video'>
<div className='video-wrapper'>
<video
id={`video-${relatedPost.fields.slug}`}
className='video-player'
src={relatedPost.fields.video.fields.file.url}
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
{relatedPost.fields.date && (
<time dateTime={new Date(relatedPost.fields.date).toISOString().slice(0, 10)}>
{new Date(relatedPost.fields.date).toLocaleDateString('en-US', {
day: '2-digit',
month: '2-digit',
year: 'numeric',
})}
</time>
)}
</div>


<div className='post-header'>
<h3>{relatedPost.fields.title}</h3>
<span>View</span>
</div>
</Link>


)}


{/* Add rendering for "Post" entries here */}
{relatedPost.type === 'Advert' && (
<a href={relatedPost.fields.externalUrl} target='_blank' rel='noopener noreferrer'>

<div className='advert-image'>
{relatedPost.fields.coverImage?.fields?.file && (
<ContentfulImage
alt={`Cover Image for ${relatedPost.fields.title}`}
src={relatedPost.fields.coverImage.fields.file.url}
width={400}
height={300}
loading='lazy'
/>
)}
</div>

{relatedPost.fields.video && (
<div className='advert-video'>
<div className='video-wrapper'>
<video
id={`video-${relatedPost.fields.slug}`}
className='video-player'
src={relatedPost.fields.video.fields.file.url}
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
{relatedPost.fields.date && (
<time dateTime={new Date(relatedPost.fields.date).toISOString().slice(0, 10)}>
{new Date(relatedPost.fields.date).toLocaleDateString('en-US', {
day: '2-digit',
month: '2-digit',
year: 'numeric',
})}
</time>
)}
</div>
<div className='advert-title'>
<h3>{relatedPost.fields.title}</h3>
</div>
<button className='advert-button'>Sponsor</button>
</a>
)}

</div>
</li>
))}
</ul>
</div>
);
};




// Render the component once data is available
return (
<div>
{renderPostContent(initialPageViews, post)}
{renderRelatedPosts()}
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



export async function getStaticProps({ params }) {
  const slug = params.slug;

  try {
    // Fetch the 'post' entry by slug
    const postResponse = await client.getEntries({
      content_type: 'post',
      'fields.slug': slug,
      limit: 1,
    });

    if (!postResponse.items.length) {
      return {
        notFound: true, // Return a 404 error if the post is not found
      };
    }

    const post = postResponse.items[0];

    // Fetch related 'post' entries and 'advert' entries in the same category as the 'post'
    const [relatedResponse, advertResponse] = await Promise.all([
      client.getEntries({
        content_type: 'post',
        'fields.category': post.fields.category,
        'fields.slug[ne]': slug, // Exclude the current post
        order: '-sys.createdAt',
        limit: 3,
      }),
      client.getEntries({
        content_type: 'advert',
        'fields.category': post.fields.category,
      }),
    ]);

    const relatedPosts = relatedResponse.items.map((relatedPost) => ({
      sys: relatedPost.sys,
      fields: relatedPost.fields,
      type: 'Post', // Add a type property to indicate it's a "Post"
    }));

    const advertPosts = advertResponse.items.map((advertPost) => ({
      sys: advertPost.sys,
      fields: advertPost.fields,
      type: 'Advert', // Add a type property to indicate it's an "Advert"
    }));

    // Combine 'relatedPosts' and 'advertPosts' into a single array
    const combinedRelatedPosts = [...relatedPosts, ...advertPosts];

    // Fetch page views from Redis and set initialPageViews
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
          relatedPosts: combinedRelatedPosts, // Include related 'post' and 'advert' entries
          initialPageViews,
        },
      };
    } catch (error) {
      console.error('Error fetching entries:', error);
      return {
        props: {
          post: {
            fields: {
              ...post.fields,
              externalUrl: post.fields.externalUrl || '',
            },
          },
          relatedPosts: [],
          initialPageViews: 0,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching entries:', error);
    return {
      props: {
        post: {
          fields: {
            ...post.fields,
            externalUrl: post.fields.externalUrl || '',
          },
        },
        relatedPosts: [],
        initialPageViews: 0,
      },
    };
  }
}



export default Post;
