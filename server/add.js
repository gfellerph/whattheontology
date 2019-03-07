const fs = require('fs');
const jsonld = require('jsonld');
const fetch = require('node-fetch');
const UrlSchema = require('./schemas/Url');
const check = require('./check');
const convert = require('./modules/convert');
const indexer = require('./modules/indexer');
const context = require('./schemas/context');

module.exports = function(server, options, next) {
  server.post('/schema', {
    schema: { body: { type: 'object', properties: { url: UrlSchema }}},
  }, async (req, res) => {
    try {
      const request = await fetch(req.body.url);
      const rawData = await request.text();
      const jsonldData = await convert(rawData, req.body.url, request.headers.get('content-type'));
      const flatted = await jsonld.flatten(jsonldData);
      const compacted = await jsonld.compact(jsonldData, context);
      
      // TODO: store those files in a persistent way
      fs.writeFile(`./refs/jsonld/${encodeURIComponent(req.body.url)}.json`, JSON.stringify(jsonldData, null, 2), 'utf-8', () => {});
      fs.writeFile(`./refs/flatted/${encodeURIComponent(req.body.url)}.json`, JSON.stringify(flatted, null, 2), 'utf-8', () => {});
      
      const validation = check(flatted);
      if (validation.hasErrors) {
        res.status = 500;
        res.send({
          message: 'Ontology contains errors',
          ...validation
        });
      } else {
        const elasticResponse = await indexer(compacted);
        if (elasticResponse.errors) {
          res.status = 500;
          res.send({
            message: 'Could not index ontology due to errors (see below)',
            ...validation,
            elasticResponse,
          });
        } else {
          res.send({
            message: 'Ontology looks good',
            ...validation,
            elasticResponse,
          });
        }
      }
    } catch(error) {
      throw error;
    }
  });
  next();
}
