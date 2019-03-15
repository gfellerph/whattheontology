const EProperties = require('../EProperties');
const localizedString = require('../localizedString');

const propertiesHtml = EProperties.map(prop => `<li>${prop}</li>`).join('');

module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://whattheontology.herokuapp.com/schemas/has-property-type.json',
  title: 'Has property definitions',
  description: `This requires at least one of the following property types to be presend in your specification: <ul>${propertiesHtml}</ul>Each property also needs a label.`,

  definitions: {
    localizedString,
    label: {
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
  minLength: 1,
  contains: {
    type: 'object',
    required: ['@graph', '@id'],
    properties: {
      '@id': {
        type: 'string',
      },
      '@graph': {
        type: 'array',
        minLength: 1,
        contains: {
          type: 'object',
          required: [
            '@type',
            'http://www.w3.org/2000/01/rdf-schema#label'
          ],
          properties: {
            '@type': {
              type: 'array',
              contains: {
                type: 'string',
                enum: EProperties
              }
            },
            'http://www.w3.org/2000/01/rdf-schema#label': {
              $ref: '#/definitions/label'
            }
          },
        }
      }
    }
  }
}