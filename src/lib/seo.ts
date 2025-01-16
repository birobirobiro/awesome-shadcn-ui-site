import { DefaultSeoProps } from "next-seo";

export const defaultSEO: DefaultSeoProps = {
  title: "awesome-shadcn-ui",
  description: "A curated list of awesome things related to shadcn/ui",
  canonical: "https://awesome-shadcn-ui.vercel.app/",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://awesome-shadcn-ui.vercel.app/",
    siteName: "awesome-shadcn-ui",
    images: [
      {
        url: "https://i.ibb.co/wdxr6M8/logo.png",
        width: 1200,
        height: 630,
        alt: "awesome-shadcn-ui",
      },
    ],
  },
  twitter: {
    handle: "@yourtwitterhandle",
    site: "@site",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "keywords",
      content:
        "shadcn, ui library, awesome, github, readme, shad, awesome list, awesome shad, shadcn ui",
    },
  ],
};

export const getSEO = (pageSEO?: Partial<DefaultSeoProps>): DefaultSeoProps => {
  return {
    ...defaultSEO,
    ...pageSEO,
    openGraph: {
      ...defaultSEO.openGraph,
      ...pageSEO?.openGraph,
    },
    twitter: {
      ...defaultSEO.twitter,
      ...pageSEO?.twitter,
    },
  };
};
