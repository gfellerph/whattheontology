const rdflib = require('rdflib');
const jsonld = require('jsonld');
const fs = require('fs');

const acceptedTypes = [
  'application/ld+json',
  'application/rdf+xml',
  'text/n3',
  'application/n3',
  'text/turtle',
  'application/x-turtle',
  'application/n-triples',
  'application/n-quads',
  'application/nquads',
];

module.exports = (data, uri, mimeType = 'application/rdf+xml') => {
  if (!mimeType) {
    return Promise.reject(new TypeError(`Resource does not provide any Content-Type: ${mimeType}`));
  }

  // Remove utf-8 encoding information
  const parsedMimeType = mimeType && mimeType.indexOf(';') >= 0 ? mimeType.split(';')[0] : mimeType;

  // Check if mime type is supported
  if (!acceptedTypes.includes(parsedMimeType)) {
    return Promise.reject(new TypeError(`Content-Type not supported: ${parsedMimeType}`));
  }

  // No need to parse if it's already application/ld+json
  if (parsedMimeType && parsedMimeType.indexOf('application/ld+json') >= 0) {
    return Promise.resolve(JSON.parse(data));
  }

  // Parse with rdflib and serialize to json-ld
  return new Promise((resolve, reject) => {
    const store = rdflib.graph();
    rdflib.parse(data, store, uri, parsedMimeType);
    rdflib.serialize(null, store, uri, 'application/n-quads', async (err, nquads) => {
      if (err) return reject(err);

      // Handle worrysome long strings with """ and line breaks
      try {
        let parsedNQuads = nquads.replace(/"""([\s\S]*?)"""/g, (m, g) => {
          return '"' + g
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t')
            .replace(/\r/g, '\\r')
            .replace(/"/g, '\\"') + '"';
        });
        
        const jsonldData = await jsonld.fromRDF(parsedNQuads, { format: 'application/n-quads' })
        // Remove any list/rest entries noise, these confuse the jsonld parser
        const filtered = jsonldData.filter(data => data['@graph'] && data['@id']);
        
        resolve(filtered);
      } catch(error) {
        reject(error);
      }
    });
  });
};
