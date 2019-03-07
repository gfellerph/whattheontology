const iso6391 = require('iso-639-1');

module.exports = {
  type: 'object',
  properties: {
    '@language': {
      type: 'string',
      enum: iso6391.getAllCodes(),
      default: 'en'
    },
    '@value': {
      type: 'string'
    }
  },
  required: [
    '@language',
    '@value'
  ]
}