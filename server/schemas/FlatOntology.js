module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://example.com/root.json',
  title: 'Flat Ontology Schema',
  definitions: {
    // localizedString: TLocalizedString,
    ontologyType: {
      type: 'array',
      items: {
        type: 'string',
      },
      contains: {
        oneOf: [
          {
            enum: ['http://www.w3.org/2002/07/owl#Ontology']
          }
        ]
      }
    }
  },
  type: 'array',
  items: {
    type: 'object',
  },
  contains: {
    type: 'object',
    properties: {
      '@type': {
        $ref: '#/definitions/ontologyType'
      }
    },
    required: ['@type']
  }
}
