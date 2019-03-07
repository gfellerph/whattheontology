const builder = require('./builder');
const rdflib = require('rdflib');
const dict = require('./ontology-dictionary');

// Commonly used properties/predicates
const label = 'http://www.w3.org/2000/01/rdf-schema#label';
const aclLabel = 'http://www.w3.org/ns/auth/acl#label';
const dcElementsDescription = 'http://purl.org/dc/elements/1.1/description';
const dcTermsDescription = 'http://purl.org/dc/terms/description';
const title = 'http://purl.org/dc/elements/1.1/title';
const comment = 'http://www.w3.org/2000/01/rdf-schema#comment';
const note = 'http://www.w3.org/2004/02/skos/core#note';

const indexable = [aclLabel, title, label, dcElementsDescription, comment, dcTermsDescription, note];

const indexMap = {
  note,
  aclLabel,
  dcTermsDescription,
  label,
  title,
  comment,
  dcElementsDescription,
};
const reverseIndexMap = Object.keys(indexMap)
  .reduce((acc, key) => {
    acc[indexMap[key]] = key;
    return acc;
  }, {});

const store = rdflib.graph();
const fetcher = new rdflib.Fetcher(store);

const fetchAvailableOntologies = () => {
  return Promise.all(Object.values(dict).map((ontology) => {
    return fetcher.load(ontology.resource);
  }));
};

module.exports = async function build() {
  await fetchAvailableOntologies()
    .catch(() => {
      // Ignore failed ontologies
      return true;
    });

  const allthestore = store
    .each();
  const filteredstore = allthestore
    .filter((item) => item.uri && item.termType === 'NamedNode');
  const uniqueStoreSet = new Set(filteredstore.map((item) => item.uri));
  const uniquestore = Array.from(uniqueStoreSet.values());
  const mappedstore = uniquestore.map((uri) => ({
    uri,
    statements: store.match(rdflib.sym(uri)),
  }));
  const indexablestore = mappedstore.filter((item) => {
    const hasIndexable = item.statements.filter((statement) => {
      return indexable.includes(statement.predicate.value);
    });
    return !!hasIndexable.length;
  });
  const mappedindexablestore = indexablestore.reduce((acc, item) => {
    const ns = dict[item.statements[0].why.value];
    acc[item.uri] = {
      uri: item.uri,
      isDefinedBy: ns || '',
      ns: ns ? ns.title : undefined,
    };
    acc[item.uri].statements = item.statements.map((statement) => {
      if (indexable.includes(statement.predicate.value)) {
        acc[item.uri][reverseIndexMap[statement.predicate.value]] = statement.object.value;
      }
      return {
        object: statement.object.value,
        predicate: statement.predicate.value,
        subject: statement.subject.value,
        why: statement.why.value,
      };
    });
    return acc;
  }, {});
  Object.values(mappedindexablestore).forEach((term) => builder.add(term));

  return {
    searchIndex: await builder.build(),
    referenceIndex: mappedindexablestore,
  };
}
