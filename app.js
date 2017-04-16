'use strict';

// Load the http module to create an http server.
const http = require('http');

// Configure our HTTP server to respond with Hello World to all requests.
const server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");
});

const PORT = process.env.PORT || 8080;
server.listen(PORT);

console.log(`App listening on port ${PORT}`);
console.log('Press Ctrl+C to quit.');