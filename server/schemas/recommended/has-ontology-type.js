const localizedString = require('../localizedString');

// Flattened array contains at least one object
// with property @type that is an array with
// at least one string defined as owl:Ontology
module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://whattheontology.herokuapp.com/schemas/has-ontology-type.json',
  title: 'Has an Ontology definition',
  description: 'This requires the type "http://www.w3.org/2002/07/owl#Ontology" to be present in the specification. The ontology also needs a title.',

  definitions: {
    localizedString,
    title: {
      type: [
          'string',
          'array',
        ],
        items: {
          $ref: '#/definitions/localizedString'
        }
    }
  },

  type: 'array',
  contains: {
    type: 'object',
    required: ['@graph'],
    properties: {
      '@graph': {
        type: 'array',
        contains: {
          type: 'object',
          properties: {
            '@type': {
              type: 'array',
              contains: {
                type: 'string',
                enum: ['http://www.w3.org/2002/07/owl#Ontology']
              }
            },
            'http://purl.org/dc/terms/title': {
              $ref: '#/definitions/title'
            },
            'http://purl.org/dc/elements/1.1/title': {
              $ref: '#/definitions/title'
            },
            'http://www.w3.org/2000/01/rdf-schema#label': {
              $ref: '#/definitions/title'
            },
          },
          oneOf: [
            { required: ['http://purl.org/dc/terms/title'] },
            { required: ['http://purl.org/dc/elements/1.1/title'] },
            { required: ['http://www.w3.org/2000/01/rdf-schema#label'] },
          ],
          required: ['@type'],
        },
      },
    },
  },
};
