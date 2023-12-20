module.exports = {
  sassOptions: {
    prependData: `@import './styles/_mixins.scss';`,
  },
  images: {
    domains: ['res.cloudinary.com', 'assets.vercel.com', 'localhost', 'herokuapp.com', 'alpine-armoring-e7d249d45874.herokuapp.com'],
  },
};
