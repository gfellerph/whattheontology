const Ajv = require('ajv');
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
        // Dereference id
        if (!property['@id'].match(/^https?:\/\//)) {
          const split = property['@id'].split(':');
          property['@id'] = `${data['@context'][split[0]]}${split[1]}`
        }
        
        // Make types always be an array
        property.types = typeof property['@type'] === 'string'
          ? [property['@type']]
          : property['@type'];

        Object.keys(property).forEach((field) => {
          // Add a new language field temporarily
          if (property[field]['@language']) { langFields.push(field); }
          // Normalize lang fields to localized strings
          if (langFields.includes(field)) {
            const localizedField = new LocalizedString(property[field]);
            property[field] = localizedField.languages;
          }

          // Delete fields that are links (they are not part of the context)
          // e.g. unindexable properties
          if (field.match(/^https?:\/\//)) {
            delete property[field];
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

  return mappedData;
}
