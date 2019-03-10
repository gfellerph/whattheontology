const jsonld = require('jsonld');
const UrlSchema = require('../schemas/Url');
const context = require('../schemas/context');
const loader = require('../modules/loader');
const checker = require('../modules/checker');
const converter = require('../modules/converter');
const indexer = require('../modules/indexer');
const logger = require('../modules/logger');
const mapper = require('../modules/mapper');
const OntologyLogger = require('../mongodb/schemas/Ontology.schema');

const findOntologyName = (graph) => {
  const ontology = graph.find((o) => o['@type'] === 'owl:Ontology' || o['@type'].includes('@type'));
  return ontology && ontology.label ? ontology.label.en : '';
}

/* OntologyLogger.deleteMany({}).then(() => {
  console.log('removed all db entries')
}); */

module.exports = function(server, options, next) {
  server.post('/schema', {
    schema: { body: { type: 'object', properties: { url: UrlSchema }}},
  }, async (req, res) => {
    let log;
    try {
      // Fetching step
      const request = await loader(req.body.url);
      const rawData = await request.text();

      // Existence check
      log = await OntologyLogger.findOne({ url: req.body.url });
      if (!log) {
        log = new OntologyLogger({ url: req.body.url });
      } else if(!log.error) {
        // This has already been successfully indexed
        return res.send({
          message: 'This ontology has already been successfully indexed, thank you for submitting.',
          url: req.body.url,
          indexed: false,
        });
      }
      
      // Conversion step
      const mimeType = request.headers.get('content-type');
      const jsonldData = await converter(rawData, req.body.url, mimeType);
      const flatted = await jsonld.flatten(jsonldData);
      const compacted = await jsonld.compact(jsonldData, context);
      
      // Validation step
      const validation = checker(flatted);
      if (validation.hasErrors) {
        res.status = 500;
        return res.send({
          message: 'Ontology contains errors',
          ...validation,
          indexed: false,
        });
      }
      
      // Indexing step
      const mapped = await mapper(compacted);
      const elasticResponse = await indexer(mapped);
      if (elasticResponse.errors) {
        res.status = 500;
        return res.send({
          message: 'Could not index ontology due to errors (see below)',
          ...validation,
          elasticResponse,
          indexed: false,
        });
      }

      // Indexing successful
      log.name = findOntologyName(mapped['@graph']);
      log.error = null;
      log.markModified('error');
      await log.save();

      res.send({
        message: 'Ontology looks good',
        url: req.body.url,
        ...validation,
        elasticResponse,
        indexed: true,
      });
    } catch(error) {
      if (!log) log = new OntologyLogger({ url: req.body.url });
      log.setError = error;
      log.markModified('error');
      await log.save(); 

      // If anything fails, throw the error to the client
      throw error;
    }
  });

  next();
}
