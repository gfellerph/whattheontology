<template lang="pug">
  div.add.container
    form
      label(for='addontology') Enter the URL to your ontology file
      input(
        id='addontology'
        type='url'
        required
        v-model='url'
        ref='addontology'
        placeholder='http://rdfs.org/sioc/ns#'
      )
      button(
        @click.prevent='add'
      ) Add to index
    p.loading(v-if="loading") loading...
    p.error(v-if="error") {{error.message}}
    div.result(v-if='response')
      h2 Result for {{url}}
      h3.h5 Failed
      ul.errors
        li(v-for='(check, index) in errored')
          span [X] {{check.label}}
          input.error-details__toggle(
            :id='`error-details-${index}`'
            type='checkbox'
          )
          p
            label.error-details__label(
              :for='`error-details-${index}`'
            )
              span.show Show
              span.hide Hide
              span  details
          div.error-details.hide
            p(v-for='detail in check.errors') {{detail.message}} at {{detail.dataPath}}
      h3.h5 Passed
      ul.passed-checks
        li(v-for='check in passed') [✓] {{check.label}}
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
export default {
  name: 'Add',
  data() {
    return {
      url: '',
      loading: false,
      error: false,
      response: null,
    };
  },
  computed: {
    passed() {
      if (!this.response) return [];
      return this.response.errors.filter((check) => !check.errors);
    },
    errored() {
      if (!this.response) return [];
      return this.response.errors.filter((check) => check.errors);
    }
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
        if (!rawResponse.ok) throw Error(res.message);
        const res = await rawResponse.json();
        this.response = res;
      } catch (error) {
        console.log(error.message);
        this.error = error;
      }
      this.loading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
  pre {
    background: GAINSBORO;
    display: inline-block;
    padding: 0 0.2em;
  }

  .hide {
    display: none;
  }

  .error-details__label {
    color: dodgerblue;
    cursor: pointer;
  }

  .error-details__toggle {
    position: absolute;
    visibility: hidden;
    &:checked {
      & ~ .hide,
      & ~ * .hide {
        display: initial;
      }
      & ~ .show,
      & ~ * .show {
        display: none;
      }
    }
  }
</style>
