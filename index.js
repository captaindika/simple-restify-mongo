'use strict'

// modul dependencies

const config  = require('./config'),
restify = require('restify'),
mongodb = require('mongodb').MongoClient
require('dotenv').config()



// initialize server
const server = restify.createServer({
  name: config.name,
  version: config.version
})


// bundled plugin  
server.use(restify.plugins.jsonBodyParser({mapParams : true}))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({mapParams: true}))
server.use(restify.plugins.fullResponse())


// connect to server
server.listen(config.port, () => {
  // console.log(config.db.uri)
  // console.log(config.port)
  mongodb.connect(config.db.uri, (err, db) => {
    if (err) {
      console.log('There is an error while attempting to connect...', err)
      process.exit(1)
    }
    console.log('%s v%s ready to accept connections on port %s in %s environment.',
    server.name,
    config.version,
    config.port,
    config.env
    )
  require('./routes')({db, server})
  })
})