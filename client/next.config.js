




const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api-hermes.pathao.com/:path*',
      },
    ];
  },
  reactStrictMode: false,
  swcMinify: true,
  env: { IMGBB_API_KEY: "b687f0db4897056f1c85a2c22b14091c" },
  images: {
    domains: [
      "icms-image.slatic.net",
      "i.ibb.co",
      "cdn.shopify.com",
      "static-01.daraz.com.bd",
      "cdn.shopify.com",
      "rukminim1.flixcart.com",
      "cdn-images.farfetch-contents.com",
      "https://static-01.daraz.com.bd",
      "4.imimg.com",
      "static-01.daraz.com.bd",
      "images.prismic.io",
      "static-01.daraz.com.bd ",
      "i.etsystatic.com",
      "www.realmenrealstyle.com",
      "static-01.daraz.com.bd",
      "placeimg.com",
      "i.postimg.cc",
      "kachabazar-store.vercel.app",
      "picsum.photos",
      "api.lorem.space",
      "ibb.co",
      "i.ibb.co.com",
    ],
  },

};

module.exports = nextConfig;
