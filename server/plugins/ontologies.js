const Ontology = require('../mongodb/schemas/Ontology.schema');

module.exports = (server, options, next) => {
  server.get('/api/ontologies', async (req, res) => {
    const response = await Ontology.find({}).select('-error.stack');
    return res.send(response);
  });

  server.get('/api/ontologies/indexed', async (req, res) => {
    return Ontology.findIndexed();
  });

  server.get('/api/ontologies/errored', async (req, res) => {
    return Ontology.findErrors();
  });

  next();
}