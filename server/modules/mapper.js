const Ajv = require('ajv');
const LocalizedString = require('../models/LocalizedString');
const langFields = require('../schemas/ELanguageFields');
const indexableSchema = require('../schemas/indexable');
const mappings = require('../schemas/IndexMappings');

const ajv = new Ajv();
const propertyChecker = ajv.compile(indexableSchema);

module.exports = (data) => {
  return Object.assign({}, data, {
    '@graph': data['@graph']
      .filter((property) => propertyChecker(property))
      .map((property) => {
        Object.keys(property).forEach((field) => {
          // Normalize lang fields to localized strings
          if (langFields.includes(field)) {
            const localizedField = new LocalizedString(property[field]);
            property[field] = localizedField.languages;
          }
          
          // Declutter properties for more efficient indexing
          Object.entries(mappings).forEach(([key, value]) => {
            if (value.includes(field)) {
              property[key] = property[field];
              delete property[field];
            }
          });
        });
        return property;
      })
  });
}
