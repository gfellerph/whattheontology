const fetch = require('node-fetch');

module.exports = async (url) => {
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/ld+json, application/rdf+xml, text/n3, text/turtle, application/n-triples, application/n-quads, application/nquads',
    }
  });
}