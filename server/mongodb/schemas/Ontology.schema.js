const mongoose = require('mongoose');
const serializeError = require('serialize-error');
const Schema = mongoose.Schema;

const Ontology = new Schema({
  url: String,
  name: String,
  homepage: String,
  prefix: String,
  error: Object,
  indexed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

Ontology.virtual('setError').set(function (value) {
  if (!value) {
    this.error = null;
  } else {
    this.error = serializeError(value);
  }
  this.markModified('error');
});

Ontology.statics.findErrors = async function () {
  return this.find({ error: { $exists: true, $ne: null }}).lean();
}

Ontology.statics.findIndexed = async function () {
  return this.find({ error: null, indexed: true }).lean();
}

Ontology.statics.exists = async function () {
  return this.find({ url: this.url });
}

module.exports = mongoose.model('Ontology', Ontology);
