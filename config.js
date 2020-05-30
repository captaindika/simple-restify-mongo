require('dotenv').config()
module.exports = {
  name: 'restifymongo',
  version: '0.0.1',
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT ,
  db: {
    uri: process.env.DB_URI
  }
}