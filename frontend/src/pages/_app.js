import '@/styles/globals.scss'
import Layout from '@/components/layout/Layout'

export default function Index ({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
