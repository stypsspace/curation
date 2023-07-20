import React from 'react';
import Image from 'next/image';
import RichText from 'src/components/ui/RichText';
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

function contentfulLoader({ src, width, quality }) {
  return `${src}?w=${width}&q=${quality || 75}`;
}

const ContentfulImage = (props) => {
  return <Image loader={contentfulLoader} {...props} />;
};

const Post = ({ post }) => {
  if (!post || !post.fields) {
    // Handle the case where the post data is not available
    return null;
  }

  const { content, name, externalUrl } = post.fields;

  return (
    <div className='post-single-wrap'>
<div className='fade-in'>

        <div className="post-single-header">
      <h3>{post.fields.title}</h3>
      <span classNameName='post-externalurl'>
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





      <div className='post-single-content'>

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

  return {
    props: {
      post: {
        fields: {
          ...post.fields,
          externalUrl: post.fields.externalUrl || '',
        },
      },
    },
  };
};

export default Post;
