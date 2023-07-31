import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Add your favicon link here */}
          <link rel="icon" href="/favicon_2.ico" type="image/x-icon" />
          {/* Other meta tags, stylesheets, or scripts can be added here */}
          <script defer data-domain="styps.space" src="https://plausible.io/js/script.js"></script>

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
