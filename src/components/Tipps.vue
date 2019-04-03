<template lang="pug">
  div.tipps
    h2 Tipps
    ul
      li Supported file formats are RDF/XML, Turtle, N3, RDFa and JSON-LD. Your URL should resolve with one of the following <pre>mimeTypes</pre>:
        ul
          li
            pre application/rdf+xml
          li
            pre text/n3
            span  or 
            pre application/n3 (legacy)
          li
            pre text/turtle
            span  or 
            pre application/x-turtle (legacy)
          li
            pre application/n-triples
          li
            pre application/ld+json
      li The ontology should have one definition with type <pre>http://www.w3.org/2002/07/owl#Ontology</pre> for the ontology itself and at least one property or class.
</template>
