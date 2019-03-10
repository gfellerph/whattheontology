const rdflib = require('rdflib');

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
    const store = rdflib.graph()
    rdflib.parse(data, store, uri, parsedMimeType)
    rdflib.serialize(null, store, uri, 'application/ld+json', (err, jsonldData) => {
      if (err) return reject(err);
      resolve(JSON.parse(jsonldData))
    });
  });
};
