module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://whattheontology.herokuapp.com/schemas/has-graph.json',
  title: 'Contains a graph',
  description: 'The ontology file, converted to a flattened json-ld document, contains at least one object with an id and a graph.',

  type: 'array',
  minLength: 1,
  contains: {
    type: 'object',
    required: ['@id', '@graph'],
    properties: {
      '@id': {
        type: 'string',
      },
      '@graph': {
        type: 'array',
        minLength: 1
      }
    },
  }
}