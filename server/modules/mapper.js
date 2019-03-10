const Ajv = require('ajv');
const jsonld = require('jsonld');
const LocalizedString = require('../models/LocalizedString');
const langFields = require('../schemas/ELanguageFields');
const indexableSchema = require('../schemas/indexable');
const mappings = require('../schemas/IndexMappings');

const ajv = new Ajv();
const propertyChecker = ajv.compile(indexableSchema);

module.exports = async (data) => {
  const mappedData = Object.assign({}, data, {
    '@graph': data['@graph']
      .filter((property) => propertyChecker(property))
      .map((property) => {
        // Make types always be an array
        property.types = typeof property['@type'] === 'string'
          ? [property['@type']]
          : property['@type'];

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
      }),
  });

  // Dereference ids and types so we always have an
  // absolute URI ID
  const expanded = await jsonld.expand(mappedData);
  const assignedGraph = mappedData['@graph'].map((indexable, index) => {
    return Object.assign({}, indexable, expanded[index]);
  });
  mappedData['@graph'] = assignedGraph;

  return mappedData;
}
