'use strict'
var ObjectId = require('mongodb').ObjectID;
module.exports = function(ctx) {
  const db = ctx.db,
  server = ctx.server

  
  const collection = db.collection('todos')
  console.log(collection)

  server.post('/todos', (req, res, next) => {
    const data = Object.assign({}, req.body, {
      created: new Date(),
      updated: new Date()
    })
    collection.insertOne(data)
      .then(doc => res.send(200, doc.ops[0]))
      .catch(err => res.send(500, err))
    next()
  })

  server.get('/todos', (req, res, next) => {
    let limit = parseInt(req.query.limit, 10) || 10, // set limit to 10 docs
    skip = parseInt(req.query.skip, 10) || 0, // default skip to 0 docs
    query = req.query || {}

    delete query.skip
    delete query.limit

    collection.find(query).skip(skip).limit(limit).toArray()
    .then(docs => res.send(200, docs))
    .catch(err => res.send(500, err))
    
    next()

  })

  server.put('/todos/:id', (req,res,next) => {
    const data = Object.assign({}, req.body, {
      updated: new Date()
    })

  let query = { _id: ObjectId(req.params.id) },
  body = { $set: data},
  opts = {
    returnOriginal: false,
    upsert: true
  }

  // find and update document based on passed in id
  collection.findOneAndUpdate(query, body, opts)
  .then(doc => res.send(204))
  .catch(err => res.send(500, err))

  next()
  })

  //delete
  server.del('/todos/:id', (req, res, next) => {
    const query = { _id: ObjectId(req.params.id)}
    const options = {"sort": { "quantity": -1 }}
    collection.findOneAndDelete(query, options)
    .then(doc => res.send(204, doc), console.log('deleted'))
    .catch(err => res.send(500, err))
    next()
  })
}