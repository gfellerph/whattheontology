module.exports = {
  label: [
    'dcterms:title',
    'dcelements:title',
    'rdfs:label',
  ],
  comment: [
    'dcterms:description',
    'dcelements:description',
    'rdfs:comment',
  ],
  note: [
    'skos:note',
  ],
  isDefinedBy: [
    'rdfs:isDefinedBy',
  ],
  domain: [
    'rdfs:domain',
    'schema:domainIncludes'
  ],
  range: [
    'rdfs:range',
    'schema:rangeIncludes',
  ],
  subPropertyOf: [
    'rdfs:subPropertyOf',
  ],
  subClassOf: [
    'rdfs:subClassOf',
  ],
  sameAs: [
    'owl:equivalentProperty',
    'schema:sameAs',
  ],
  inverseOf: [
    'owl:inverseOf'
  ]
}