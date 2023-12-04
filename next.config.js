// const fs = require('fs');
// const path = require('path');

module.exports = {
  sassOptions: {
    // includePaths: [path.join(__dirname, 'src', 'styles')],
    // prependData: fs.readFileSync(path.join(__dirname, 'styles/_mixins.scss'), 'utf8'),
    prependData: `@import './styles/_mixins.scss';`,
  },
  images: {
    domains: ['localhost'],
  },
};
