const jsonld = require('jsonld');
const fetch = require('node-fetch');
const UrlSchema = require('../schemas/Url');
const context = require('../schemas/context');
const checker = require('../modules/checker');
const converter = require('../modules/converter');
const indexer = require('../modules/indexer');

module.exports = function(server, options, next) {
  server.post('/schema', {
    schema: { body: { type: 'object', properties: { url: UrlSchema }}},
  }, async (req, res) => {
    try {
      // Fetching step
      const request = await fetch(req.body.url);
      const rawData = await request.text();

      // Conversion step
      const jsonldData = await converter(rawData, req.body.url, request.headers.get('content-type'));
      const flatted = await jsonld.flatten(jsonldData);
      const compacted = await jsonld.compact(jsonldData, context);
      
      // Validation step
      const validation = checker(flatted);
      if (validation.hasErrors) {
        res.status = 500;
        return res.send({
          message: 'Ontology contains errors',
          ...validation
        });
      }
      
      // Indexing step
      const elasticResponse = await indexer(compacted);
      if (elasticResponse.errors) {
        res.status = 500;
        return res.send({
          message: 'Could not index ontology due to errors (see below)',
          ...validation,
          elasticResponse,
        });
      }
      
      res.send({
        message: 'Ontology looks good',
        ...validation,
        elasticResponse,
      });
    } catch(error) {
      // If anything fails, throw the error to the client
      throw error;
    }
  });

  next();
}
