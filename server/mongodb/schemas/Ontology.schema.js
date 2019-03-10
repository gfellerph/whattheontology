const mongoose = require('mongoose');
const serializeError = require('serialize-error');
const Schema = mongoose.Schema;

const Ontology = new Schema({
  url: String,
  name: String,
  error: Object,
}, {
  timestamps: true,
});

Ontology.virtual('setError').set(function (value) {
  this.error = serializeError(value);
});

Ontology.methods.findErrors = async function () {
  return this.model.find({ error: { $exists: true }});
}

Ontology.methods.findIndexed = async function () {
  return this.model.find({ error: { $exists: false }});
}

Ontology.methods.exists = async function () {
  return this.model.find({ url: this.url });
}

module.exports = mongoose.model('Ontology', Ontology);
