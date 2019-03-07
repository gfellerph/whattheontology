const elasticsearch = require('elasticsearch');
const mapper = require('./mapper');

const mappings = {
  ontology: {
    mappings: {
      property: {
        properties: {
          label: {
            properties: {
              en: {
                type: 'text',
                analyzer: 'english'
              }
            }
          },
          comment: {
            properties: {
              en: {
                type: 'text',
                analyzer: 'english'
              }
            }
          },
          note: {
            properties: {
              en: {
                type: 'text',
                analyzer: 'english'
              }
            }
          },
        },
      },
    },
  },
};
const options = {
  host: process.env.ELASTIC_HOST
}

const client = elasticsearch.Client(options);

/* client.indices.delete({ index: 'ontology' }).then(() => {
  console.log('index deleted');
}); */
module.exports = async (dataset) => {
  try {
    if (!await client.indices.exists({ index: 'ontology' })) {
      await client.indices.create({
        index: 'ontology',
      });
    }
    await client.indices.putMapping({
      index: 'ontology',
      type: 'property',
      body: mappings.ontology.mappings.property
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
  const mapped = mapper(dataset);
  const bulk = mapped['@graph'].reduce((acc, current, index) => {
    // To be a indexable, it must have an id and a type
    if (!current['@id'] || !current['@type']) return acc;

    acc.push({
      index: {
        _index: 'ontology',
        _type: 'property',
        _id: current['@id'],
      }
    });
    acc.push(current);
    return acc;
  }, []);
  const res = await client.bulk({
    body: bulk,
    timeout: '30s'
  });
  console.log(`Indexed ${mapped['@graph'].length} properties`);
  return res;
}