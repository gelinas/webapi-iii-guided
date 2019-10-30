const express = require('express'); // importing a CommonJS module
const helmet = require('helmet') // third-party secure middleware
const morgan = require('morgan') // logger middleware

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// custome middleware definitions

function dateLogger(req, res, next) {
  console.log(new Date().toISOString());

  next();
}

function logger(req, res, next) {
  console.log(`The Logger: [${new Date().toISOString()}] ${req.method} to ${req.url}`)
}

function gateKeeper(req, res, next) {
  // data can come in the body, url parameters, query string, headers
  // new way of reading data sent by the client
  if(!req.headers.password) {
    res.status(400).json({ you: 'Please provide a password!' });
  }
  const password = req.headers.password || '';
  if (password.toLowerCase() === 'mellon') {
    next();
  } else {
    res.status(401).json({ you: 'cannot pass!!' });
  }
}

// global middleware, run as queue (first-in-first-out)
server.use(helmet);
server.use(express.json()); // third-party
server.use(gateKeeper);
// server.use(dateLogger);
server.use(logger);
server.use(morgan('dev'));


server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
