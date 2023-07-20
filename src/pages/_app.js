import Layout from '@/components/layout';
import '@/styles/globals.css';
import '@/styles/custom.css';
import '@/styles/styles.css'; 
import 'typeface-inter';

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
