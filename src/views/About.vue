<template lang="pug">
  div.about.container
    h2 What the ontology
    p A search engine for RDF namespaces, properties, classes, ontologies and datatypes recommended by the <a href="https://solid.mit.edu/">SOLID project</a> and more.
    p This service is in alpha stage right now. The ontologies listed by the SOLID project are highly inconsistent in their format, availability and completeness. Therefore it is possible that some of the listed ontologies might fail to get indexed. The below list shows ontologies that were indexed as well as those that failed.
    p.list-filter.text-align-right
      label(for="show_successful")
        input(
          id="show_successful"
          type="checkbox"
          v-model="showSuccessful"
        )
        span Show successful
      label(for="show_errors")
        input(
          id="show_errors"
          type="checkbox"
          v-model="showFailed"
        )
        span Show failed
      
    p.errors(v-if="error") {{error.message}}
    p(v-if="loading")
      loading
    ul
      li(
        v-for="(ont, i) in filteredOntologies"
        :key="i"
      )
        span(v-if="ont.error") [X] 
        span(v-else) [✓] 
        a(:href="ont.url")
          span {{ont.prefix}} - {{ont.name || ont.url}}
        span(v-if="ont.error")  ({{ont.error.message}})

</template>

<script>
export default {
  data() {
    return {
      indexedOntologies: [],
      error: false,
      loading: false,
      showFailed: true,
      showSuccessful: true,
    }
  },
  created() {
    this.loadIndexedOntologies();
  },
  computed: {
    filteredOntologies() {
      return this.indexedOntologies.filter((ontology) => {
        const errored = !!ontology.error;
        return errored && this.showFailed || !errored && this.showSuccessful;
      });
    }
  },
  methods: {
    async loadIndexedOntologies() {
      this.loading = true;
      this.error = false;
      try {
        const raw = await fetch('/api/ontologies');
        this.indexedOntologies = await raw.json();
      } catch (error) {
        this.error = error;
      }
      this.loading = false;
    },
  },
}
</script>

<style lang="scss">
  .list-filter {
    label {
      margin: 0 1rem;
    }
  }
</style>

