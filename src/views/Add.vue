<template lang="pug">
  div.add.container
    form
      div.input__field.has-button
        input(
          id='addontology'
          type='url'
          required
          v-model='url'
          ref='addontology'
          placeholder='http://rdfs.org/sioc/ns#'
        )
        label.hover(for='addontology') Enter the URL to your ontology file
        button(
          @click.prevent='add'
        )
          span Add
    loading(v-if="loading")
    div(v-if="error")
      h2 D'oh!
      p.error {{error.message}}
    div(v-if="response")
      h2 Success!
      p(v-if="response.indexed") Indexed {{response.elasticResponse.items.length}} properties of {{response.url}} successfully
      p(v-if="!response.indexed") {{response.message}}
    reporter(v-if="response" :results="response")
    div.tipps(v-if="!loading && !response")
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

<script>
import Reporter from '@/components/Reporter';
export default {
  name: 'Add',
  components: { Reporter },
  data() {
    return {
      url: '',
      loading: false,
      error: false,
      response: null,
    };
  },
  methods: {
    async add() {
      this.response = null;
      this.error = false;
      this.loading = true;
      try {
        const rawResponse = await fetch('/schema', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: this.url,
          }),
        });
        if (!rawResponse.ok) {
          const error = await rawResponse.text();
          throw error;
        }
        const res = await rawResponse.json();
        this.response = res;
        this.url = '';
      } catch (error) {
        this.error = JSON.parse(error);
      }
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
  pre {
    background: GAINSBORO;
    display: inline-block;
    padding: 0 0.2em;
  }  
</style>
