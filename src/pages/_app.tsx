import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import Donation from "@/components/donation";
import { Footer } from "@/components/layout/footer";
import Head from "next/head";
import { Header } from "@/components/layout/header";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { defaultSEO } from "@/lib/seo";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-KKW79YC8KG"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KKW79YC8KG');
        `}
      </Script>
      <DefaultSeo {...defaultSEO} />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
      >
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        <Donation />
        <Footer />
        <Toaster />
      </ThemeProvider>
    </>
  );
}
