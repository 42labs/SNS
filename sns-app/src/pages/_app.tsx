import React from 'react'
import { AppProps } from 'next/app'

import '../styles/index.css'
import SNSFooter from '../components/SNSFooter';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-violet-300 min-h-screen">
      <Component {...pageProps} />
      <SNSFooter />
    </div>
  )
}

export default MyApp;
