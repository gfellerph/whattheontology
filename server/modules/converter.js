const rdflib = require('rdflib');
const jsonld = require('jsonld');
const fs = require('fs');

module.exports = (store, uri) => {

  // Parse with rdflib and serialize to json-ld
  return new Promise((resolve, reject) => {
    /* const store = rdflib.graph();
    rdflib.parse(data, store, uri, parsedMimeType); */
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
        fs.writeFileSync('./refs/latestnquads.txt', parsedNQuads);
        const jsonldData = await jsonld.fromRDF(parsedNQuads, { format: 'application/n-quads' });

        // Remove any list/rest entries noise, these confuse the jsonld parser
        const filtered = jsonldData
          .filter(data => data['@graph'] && data['@id'])
          .filter(data => uri.indexOf(data['@id']) >= 0);
        
        // Oops, filtered too much or there was no reasonable data in the store
        if (filtered.length === 0) {
          return reject(new Error('Failed to parse ontology to json-ld for checking.'))
        }

        resolve(filtered);
      } catch(error) {
        reject(error);
      }
    });
  });
};
