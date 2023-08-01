// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { pageview } from '@/lib/gtag';
import Layout from '@/components/layout';
import '@/styles/globals.css';
import '@/styles/custom.css';
import '@/styles/animation.css'; 
import '@/styles/responsive.css'; 
import 'typeface-inter';

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url, document.title);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
