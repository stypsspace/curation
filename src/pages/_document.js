import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Add your favicon link here */}
          <link rel="icon" href="/favicon_2.ico" type="image/x-icon" />
          <title>Styps — Curated websites for inspiration and promotion of good design</title>
          {/* Other meta tags, stylesheets, or scripts can be added here */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;