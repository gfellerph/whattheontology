const rdflib = require('rdflib');

module.exports = (data, uri, mimeType) => {
  if (mimeType === 'application/ld+json') {
    return Promise.resolve(data);
  }
  return new Promise((resolve, reject) => {
    const store = rdflib.graph()
    rdflib.parse(data, store, uri, mimeType)
    rdflib.serialize(null, store, uri, 'application/ld+json', (err, jsonldData) => {
      if (err) return reject(err);
      resolve(JSON.parse(jsonldData))
    });
  });
};
