const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: process.env.ELASTIC_HOST,
});

module.exports = (server, options, next) => {
  server.post('/search', {
    body: {
      type: 'object',
      properties: { query: { type: 'string' }},
    }
  }, async (req, res) => {
    if (!req.body.query) {
      throw new Error('No query')
    }
    try {
      const response = await client.search({
        index: 'ontology',
        body: {
          query:{
            multi_match:{
              query: req.body.query,
              fields: ["label.en^2","comment.en"]
            },
          },
        },
      });

      res.send(response);
    } catch(error) {
      if (error.status === 404) {
        res.status(404);
        return res.send({ hits: { hits: [] } });
      }
      throw error;
    }
  });

  next();
}
