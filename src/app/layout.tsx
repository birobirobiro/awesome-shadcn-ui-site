import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "awesome-shadcn-ui",
  description: "A curated list of awesome things related to shadcn/ui",
  keywords: [
    "shadcn",
    "ui library",
    "awesome",
    "github",
    "readme",
    "shad",
    "awesome list",
    "awesome shad",
    "shadcn ui",
  ],
  authors: [{ name: "birobirobiro" }],
  openGraph: {
    title: "awesome-shadcn-ui",
    description: "A curated list of awesome things related to shadcn/ui",
    url: "https://awesome-shadcn-ui.vercel.app/",
    siteName: "awesome-shadcn-ui",
    images: [
      {
        url: "https://i.ibb.co/wdxr6M8/logo.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "awesome-shadcn-ui",
    description: "A curated list of awesome things related to shadcn/ui",
    images: ["https://i.ibb.co/wdxr6M8/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KKW79YC8KG"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KKW79YC8KG');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" forcedTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
