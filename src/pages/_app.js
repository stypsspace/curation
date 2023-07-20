import Layout from '@/components/layout';
import '@/styles/globals.css';
import '@/styles/custom.css';
import '@/styles/animation.css'; 
import '@/styles/responsive.css'; 
import 'typeface-inter';

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
