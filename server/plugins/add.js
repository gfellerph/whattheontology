const jsonld = require('jsonld');
const UrlSchema = require('../schemas/Url');
const context = require('../schemas/context');
const loader = require('../modules/loader');
const checker = require('../modules/checker');
const converter = require('../modules/converter');
const indexer = require('../modules/indexer');
const mapper = require('../modules/mapper');
const informer = require('../modules/informer');
const OntologyLogger = require('../mongodb/schemas/Ontology.schema');
const fs = require('fs');

module.exports = function(server, options, next) {
  server.post('/schema', {
    schema: { body: {
      type: 'object',
      required: ['url'],
      properties: { url: UrlSchema },
      additionalProperties: false,
    }},
  }, async (req, res) => {
    let log;
    console.log('got ont', req.body.url);
    try {
      // Existence check
      log = await OntologyLogger.findOne({
        url: req.body.url
      });
      if (!log) {
        log = new OntologyLogger({ url: req.body.url });
      } else if(log.indexed) {
        // This has already been successfully indexed
        return res.send({
          message: 'This ontology has already been successfully indexed, thank you for submitting.',
          url: req.body.url,
          indexed: false,
        });
      }
      
      // Fetching step
      const store = await loader(req.body.url);
      const infos = await informer(req.body.url)
        .catch(() => {});
      

      if (infos) {
        log.name = infos.titles.find(t => t.lang === 'en').value;
        log.prefix = infos.prefix;
        log.homepage = infos.homepage;
      }

      console.log('fetching done, starting conversion')
      
      // Conversion step
      const jsonldData = await converter(store, req.body.url);
      const flatted = await jsonld.flatten(jsonldData);
      const compacted = await jsonld.compact(jsonldData, context);
      fs.writeFileSync('./refs/latestjsonData.json', JSON.stringify(jsonldData, null, 2));
      fs.writeFileSync('./refs/latestflatted.json', JSON.stringify(flatted, null, 2));
      fs.writeFileSync('./refs/latestcompacted.json', JSON.stringify(compacted, null, 2));
      
      // Validation step
      const validation = checker(flatted);
      if (validation.hasErrors) {
        log.setError = new Error('Validation failed');
        log.save();
        res.status = 500;
        return res.send({
          message: 'Ontology contains errors',
          ...validation,
          indexed: false,
        });
      }
      
      // Indexing step
      const mapped = await mapper(compacted);
      fs.writeFileSync('./refs/latestmapped.json', JSON.stringify(mapped, null, 2));
      const elasticResponse = await indexer(mapped);
      if (elasticResponse.errors) {
        log.setError = new Error('Indexing error');
        log.save();
        res.status = 500;
        return res.send({
          message: 'Could not index ontology due to errors (see below)',
          ...validation,
          elasticResponse,
          indexed: false,
        });
      }

      // Indexing successful
      log.setError = null;
      log.indexed = true;
      log.save();

      res.send({
        message: 'Ontology looks good',
        url: req.body.url,
        ...validation,
        elasticResponse,
        indexed: true,
      });
    } catch(error) {
      console.log(error);
      if (!log) log = new OntologyLogger({ url: req.body.url });
      log.setError = error;
      await log.save(); 

      // If anything fails, throw the error to the client
      throw error;
    }
  });

  next();
}
