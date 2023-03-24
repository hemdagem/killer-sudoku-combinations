import type { GatsbyConfig } from "gatsby";

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const config: GatsbyConfig = {
  siteMetadata: {
    title: ``,
    siteUrl: `https://www.yourdomain.tld`,
    productsPerPage: Number(process.env.PRODUCTS_PER_PAGE)
  },
  plugins: ["gatsby-plugin-image","gatsby-plugin-sharp",  "gatsby-transformer-sharp", "gatsby-plugin-react-helmet", "gatsby-plugin-sitemap", {
    resolve: 'gatsby-plugin-manifest',
    options: {
      "icon": "src/images/icon.png"
    }
  },
  `gatsby-transformer-json`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `./src/data/`,
    },
  },
]
};

export default config;
