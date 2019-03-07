const rdflib = require('rdflib');

module.exports = (data, uri, mimeType) => {
  if (mimeType.indexOf('application/ld+json') >= 0) {
    return Promise.resolve(JSON.parse(data));
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
