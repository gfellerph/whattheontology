const path = require('path');
const fastify = require('fastify');
const compress = require('fastify-compress');
const fastifyStatic = require('fastify-static');
const add = require('./plugins/add');

/*
  TODO:
    - Use markdown to render comments/descriptions etc.
    - Truncate comments/descriptions and extend
    - Compact list view mode
    - Add all the specs from https://github.com/solid/solid-ui/blob/master/src/ns.js
    - Resolve timing issue with async indexing and server get response to searches
    - Mark recommended namespaces/terms
    - Cleanup code
    - Comment functions
    - Use functional programming to build the index
    - Write a nice readme.md
*/

const server = fastify();
server.register(fastifyStatic, {
  root: path.join(process.cwd(), 'dist'),
});
server.register(compress);
server.register(add);
server.listen(process.env.PORT || 3000, (err, address) => {
  console.log(`Server listening at ${address}`);
});

// SPA workaround, deliver index.html no matter what
server.setNotFoundHandler((request, response) => {
  response.sendFile('index.html');
});

module.exports = server;
