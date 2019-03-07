const Ajv = require('ajv');
const requireGlob = require('require-glob');

const ajv = new Ajv({
  removeAdditional: false, // remove additional properties
  useDefaults: true, // replace missing properties and items with the values from corresponding default keyword
  coerceTypes: false, // change data type of data to match type keyword
  allErrors: true,    // check for all errors
});

const tester = (schema, data) => {
  const validator = ajv.compile(schema);
  validator(data);
  return {
    id: schema['$id'],
    label: schema.label,
    errors: validator.errors,
  }
};

const hasErrors = (err, current) => err || !!current.errors;

const requiredSchemas = Object.values(requireGlob.sync('./schemas/required/*.{js,json}'));
const warningsSchemas = Object.values(requireGlob.sync('./schema/warnings/*.{js,json}'));
const recommendedSchemas = Object.values(requireGlob.sync('./schemas/recommended/*.{js,json}'));

module.exports = (data) => {
  const errors = requiredSchemas.map(schema => tester(schema, data));
  const warnings = warningsSchemas.map(schema => tester(schema, data));
  const recommendations = recommendedSchemas.map(schema => tester(schema, data));

  return {
    errors,
    warnings,
    recommendations,
    hasErrors: errors.reduce(hasErrors, false),
    hasWarnings: warnings.reduce(hasErrors, false),
    hasRecommendations: recommendations.reduce(hasErrors, false),
  }
}
