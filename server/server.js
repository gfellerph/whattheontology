const path = require('path');
const fastify = require('fastify');
const compress = require('fastify-compress');
const fastifyStatic = require('fastify-static');
const build = require('./index');
const add = require('./add');

/*
  TODO:
    - Use markdown to render comments/descriptions etc.
    - Truncate comments/descriptions and extend
    - Compact list view mode
    - Create dictionary with all namespaces
    - Add all the specs from https://github.com/solid/solid-ui/blob/master/src/ns.js
    - Resolve timing issue with async indexing and server get response to searches
    - Mark recommended namespaces/terms
    - Concat different label/title/aclLabel and comments/descriptions to get
      unified search fields and less frontend hassle
    - Cleanup code
    - Comment functions
    - Use functional programming to build the index
    - Write a nice readme.md
    - Publish on heroku
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

let sIndex;
let rIndex;

/* build()
  .then(({
    searchIndex,
    referenceIndex,
  }) => {
    sIndex = searchIndex;
    rIndex = referenceIndex;
    // tslint:disable-next-line:no-console
    console.log(`indexed ${Object.keys(rIndex).length} properties`);
  })
  .catch((error) => {
    throw new Error(error);
  }); */


server.get('/search', async (request, response) => {
  if (!sIndex) {
    throw new Error('Index not ready');
  }

  // Index won't change so often, let the client cache queries for 10min
  response.header('Cache-Control', 'public, max-age=600');

  // Early response if empty
  if (!request.query.search) {
    return [];
  }

  // Format input term
  let term = request.query.search.trim().toLowerCase();

  // Parse term to be AND instead of OR with multiple words
  term = term.replace(/\s(?![\+-])/g, ' +');
  if (term[0] !== '+') { term = `+${term}`; }

  return sIndex
    .search(term)
    .map((r) => rIndex[r.ref]);
});

// SPA workaround, deliver index.html no matter what
server.setNotFoundHandler((request, response) => {
  response.sendFile('index.html');
});

module.exports = server;
