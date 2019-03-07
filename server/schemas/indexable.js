const localizedString = require('./localizedString');

module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://example.com/root.json',
  title: 'Checks if an ontology field is indexable',

  definitions: {
    localizedString,
  },

  type: 'object',
  properties: {
    '@id': {
      type: 'string',
    },
    '@type': {
      type: ['string', 'array'],
    },
    'rdfs:label': {
      '#ref': '#/definitions/localizedString',
    },
    'dcterms:title': {
      '#ref': '#/definitions/localizedString',
    },
    'dcelements:title': {
      '#ref': '#/definitions/localizedString',
    },
  },
  required: ['@id', '@type'],
  oneOf: [
    { required: ['rdfs:label'] },
    { required: ['dcterms:title'] },
    { required: ['dcelements:title'] },
  ],
}