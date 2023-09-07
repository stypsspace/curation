import React from 'react';
import Link from 'next/link';
import client from 'src/lib/contentful';
import RichText from 'src/components/ui/RichText';
import Image from 'next/image';
import Head from 'next/head';

const contentfulLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

const ContentfulImage = (props) => {
  return <Image loader={contentfulLoader} alt={props.alt} {...props} />;
};

const ProductPage = ({ product, relatedProducts }) => {
  const { title, image, video, slug, description, price, content, externalUrl } = product.fields;

  // Sort the related products array by createdAt date in descending order
  const sortedRelatedProducts = relatedProducts.sort((product1, product2) => {
    const createdAt1 = new Date(product1.sys.createdAt).getTime();
    const createdAt2 = new Date(product2.sys.createdAt).getTime();
    return createdAt2 - createdAt1; // Sort in descending order (latest first)
  });

  return (
    <div className="product-container">
      <Head>
        <title>{title} - Your Product Name</title>
      </Head>
      <Link href="/shop">Back to Shop</Link>

      <div className="product-content">
       

        <div className="product-image">
          <Link href={`/shop/${slug}`} aria-label={title}>
            {video ? (
              <div className="video-wrapper">
                <video
                  className="video-player"
                  src={video.fields.file.url}
                  width={400}
                  height={300}
                  autoPlay
                  loop
                  controls={false}
                  muted
                  playsInline
                ></video>
              </div>
            ) : (
              image && image.fields && image.fields.file && (
                <ContentfulImage
                  alt={`Image for ${title}`}
                  src={image.fields.file.url}
                  width={400}
                  height={300}
                  loading="lazy"
                />
              )
            )}
          </Link>
        </div>

       <div className='product-single-title'>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>Price: {price}</p>
        <span className='product-single-externalurl'>
            {externalUrl && (
              <a href={externalUrl} target='_blank' rel='noopener noreferrer' className='mt-4 text-blue-500 underline'>
                Buy
              </a>
            )}
          </span>
        </div>

        <div className='product-single-paragraph'>
          <RichText content={content} />
        </div>
      </div>

      {/* Display related products */}
      <div className="related-products-wrap">
        <h3 className="related-products-title">Related Products</h3>
        <ul className="related-products-content">
          {sortedRelatedProducts.map((relatedProduct) => (
            <li key={relatedProduct.fields.slug}>
              <div className="related-product-image">
                {relatedProduct.fields.image && relatedProduct.fields.image.fields.file && (
                  <Link href={`/shop/${relatedProduct.fields.slug}`} aria-label={relatedProduct.fields.title}>
                    <ContentfulImage
                      alt={`Image for ${relatedProduct.fields.title}`}
                      src={relatedProduct.fields.image.fields.file.url}
                      width={200}
                      height={150}
                      loading="lazy"
                    />
                  </Link>
                )}
              </div>
              <div className="related-product-header">
                <h3>
                  <Link href={`/shop/${relatedProduct.fields.slug}`} aria-label={relatedProduct.fields.title}>
                    {relatedProduct.fields.title}
                  </Link>
                </h3>
                <p>{relatedProduct.fields.price}</p>
              </div>
              {relatedProduct.fields.video && (
                <div className="related-product-video">
                  <Link href={`/shop/${relatedProduct.fields.slug}`} aria-label={relatedProduct.fields.title}>
                    <video
                      className="video-player"
                      src={relatedProduct.fields.video.fields.file.url}
                      width={400}
                      height={300}
                      autoPlay
                      loop
                      controls={false}
                      muted
                      playsInline
                    ></video>
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const response = await client.getEntries({ content_type: 'shop' });

  const paths = response.items.map((entry) => ({
    params: { slug: entry.fields.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const response = await client.getEntries({
    content_type: 'shop',
    'fields.slug': params.slug,
    limit: 1,
  });

  const product = response.items[0];

  // Fetch all products with the same category as the current product
  const allProductsResponse = await client.getEntries({
    content_type: 'shop',
    'fields.category': product.fields.category, // Replace 'category' with your actual field name for the category
  });

  // Filter only the products that have a 'video' field
  const relatedProducts = allProductsResponse.items.filter((item) => item.fields.video);

  // Remove the current product from the related products array
  const filteredRelatedProducts = relatedProducts.filter((item) => item.sys.id !== product.sys.id);

  return {
    props: {
      product: {
        fields: {
          ...product.fields,
        },
      },
      relatedProducts: filteredRelatedProducts.slice(0, 5), // Limit the number of related products to 5
    },
  };
}

export default ProductPage;
