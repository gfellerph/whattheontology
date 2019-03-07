<template lang="pug">
  div.about.container
    h2 What the ontology
    p A search engine for RDF namespaces, properties, classes, ontologies and datatypes recommended by the <a href="https://solid.mit.edu/">SOLID project</a>.
    ul
      li(
        v-for="(ont, i) in orderedDict"
        :key="i"
      )
        a(:href="ont.resource") {{ont.title}}
        span.lightgrey  ({{ont.resource}})
</template>

<script>
import dict from '@/../server/ontology-dictionary.js';

export default {
  data() {
    return {
      dict,
    }
  },
  computed: {
    orderedDict() {
      return Object.values(this.dict).sort((a, b) => {
        return a.title.toUpperCase() < b.title.toUpperCase() ? -1 : 1;
      });
    }
  }
}
</script>
