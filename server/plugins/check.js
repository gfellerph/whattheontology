const rdflib = require('rdflib');
const jsonld = require('jsonld');
const EMimeTypes = require('../schemas/EMimeTypes');
const converter = require('../modules/converter');
const checker = require('../modules/checker');
const context = require('../schemas/context');
const fs = require('fs');

module.exports = (server, options, next) => {
  server.post('/api/check/text', {
    schema: {
      body: {
        type: 'object',
        required: ['text'],
        additionalProperties: false,
        properties: {
          text: {
            type: 'string',
          },
          mimeType: {
            type: 'string',
            enum: EMimeTypes,
          },
        },
      },
    },
  }, async (req, res) => {
      const tempUrl = 'https://whattheontology.org/schemas/';
    try {
      // Parse to store
      const store = rdflib.graph();
      rdflib.parse(req.body.text, store, tempUrl, req.body.mimeType);
  
      // Convert to json-ld
      const jsonldData = await converter(store, tempUrl);
      const flatted = await jsonld.flatten(jsonldData);
      const compacted = await jsonld.compact(jsonldData, context);
      fs.writeFileSync('./refs/latestjsonData_text.json', JSON.stringify(jsonldData, null, 2));
      fs.writeFileSync('./refs/latestflatted_text.json', JSON.stringify(flatted, null, 2));
      fs.writeFileSync('./refs/latestcompacted_text.json', JSON.stringify(compacted, null, 2));
  
      // Check
      const validation = checker(flatted);
      if (validation.hasErrors) {
        res.status = 500;
        return res.send({
          message: 'Ontology contains errors',
          ...validation,
          indexed: false,
        });
      }

      res.send({
        message: 'Ontology looks good',
        ...validation,
        indexed: false,
      });
    } catch (error) {
      // If anything fails, throw the error to the client
      throw error;
    }
  });
  next();
}