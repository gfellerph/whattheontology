const Ontology = require('../mongodb/schemas/Ontology.schema');
const elasticsearch = require('elasticsearch');
const pl = require('fastify-plugin');

module.exports = pl((server, options, next) => {
  server.get('/api/retry', async (req, res) => {
    const failedUrls = await Ontology.findErrors();
    for (fail of failedUrls) {
      const response = await server.inject('/schema', {
        method: 'POST',
        body: JSON.stringify({
          url: fail.url,
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      console.log(fail.url, response.status);
    }
    res.send('ok');
  });

  server.get('/api/reset', async (req, res) => {
    const options = {
      host: process.env.ELASTIC_HOST
    }

    const client = elasticsearch.Client(options);

    const clearIndex = client.indices.delete({ index: 'ontology' });

    // const clearDB = Ontology.updateMany({}, { indexed: false });
    const clearDB = Ontology.deleteMany({});

    await Promise.all([clearIndex, clearDB]);
    res.send('indices and db reset to 0');
  });
  
  next();
});
