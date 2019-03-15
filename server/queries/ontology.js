const sparqlQuery = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dce: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    SELECT *
    WHERE {
      ?ontology rdf:type owl:Ontology.
      ?ontology dct:title ?label.
    }
  `;
  const query = rdflib.SPARQLToQuery(sparqlQuery, false, store);
  return new Promise((resolve, reject) => {
    store.query(query, (result) => {
      console.log(result);
    }, undefined, (result) => {
      console.log(result);
    });