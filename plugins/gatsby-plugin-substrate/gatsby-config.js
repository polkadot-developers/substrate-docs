/* read the `.env.*` files, gatsby builtin */
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {};
