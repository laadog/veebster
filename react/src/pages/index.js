import Head from 'next/dist/shared/lib/head';
import React from 'react';
import { ThemeProvider } from 'theme-ui';
import theme from '../theme/index2';
import Layout from 'src/components/layout';
import Banner from 'src/sections/banner';
import Faq from 'src/sections/faq';
import Security from 'src/sections/security';
import MobileApp from 'src/sections/mobile-app';
import Dashboard from 'src/sections/dashboard';
import UltimateFeatures from 'src/sections/ultimate-features';


export default function IndexPage() {
  return (
    <>
    <Head>
      <title>Home | Veebster Analyzer</title>
    </Head>
      <ThemeProvider theme={theme}>
        <Layout>

          <Banner />
          <Security />
          <Dashboard />
          <MobileApp />
          <UltimateFeatures />
          <Faq />
        </Layout>
      </ThemeProvider>
  </>
  );
}
