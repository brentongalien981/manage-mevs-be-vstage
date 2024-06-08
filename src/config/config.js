// config/config.js
require('dotenv').config();

module.exports = {
  db: {
    uri: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  },
  port: process.env.PORT || 3000,
};
