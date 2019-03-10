const Ajv = require('ajv');
const requireGlob = require('require-glob');

const ajv = new Ajv({
  removeAdditional: false, // remove additional properties
  useDefaults: true, // replace missing properties and items with the values from corresponding default keyword
  coerceTypes: false, // change data type of data to match type keyword
  allErrors: true,    // check for all errors
});

// TODO: maybe run tests async if this is generally supported by ajv
const tester = (schema, data, level) => {
  const validator = ajv.compile(schema);
  validator(data);
  return {
    id: schema['$id'],
    title: schema.title,
    description: schema.description,
    level,
    errors: validator.errors,
  }
};

const hasErrors = (err, current) => err || !!current.errors;

// Get schemas
const requiredSchemas = Object.values(requireGlob.sync('../schemas/required/*.{js,json}'));
const recommendedSchemas = Object.values(requireGlob.sync('../schemas/recommended/*.{js,json}'));

module.exports = (data) => {
  // Compile and execute tests
  const errors = requiredSchemas.map(schema => tester(schema, data, 'required'));
  const recommendations = recommendedSchemas.map(schema => tester(schema, data, 'recommended'));
  const checks = [...errors, ...recommendations];
  let passed = 0;
  let failed = 0;
  checks.forEach((check) => {
    if (check.errors) { failed += 1; } else { passed += 1}
  });

  // Aggregate return object
  return {
    totalChecks: checks.length,
    failed,
    passed,
    checks,
    hasErrors: errors.reduce(hasErrors, false),
    hasRecommendations: recommendations.reduce(hasErrors, false),
  }
}
