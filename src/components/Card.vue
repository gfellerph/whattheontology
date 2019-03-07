<template lang="pug">
  li.card(
  )
    header
      h2 {{hit._source.label.en}}
      p.small
        a.ns-uri(
          :href="hit._source['rdfs:isDefinedBy']['@id']"
          v-if="hit._source['rdfs:isDefinedBy']"
        ) {{hit._source['rdfs:isDefinedBy']['@id']}}
        span :&nbsp;
        span.italic.lightgrey.uri(
          title="Copy URI"
          v-clipboard="hit._source['@id']"
        ) {{hit._source['@id']}}
    article.box
      p(v-if="hit._source.comment") {{hit._source.comment.en}}
      p(v-if="hit._source.note") {{hit._source.note.en}}
      p
        type(
          v-for="(type, index) in types"
          :key="index"
          :type="type"
        )
</template>

<script>
import Type from '@/components/Type';
const colorCodes = {
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property': {
    color: '#ff5722',
    title: 'rdf:Property',
  },
  'http://www.w3.org/2002/07/owl#DatatypeProperty': {
    color: '#e91e63',
    title: 'owl:DatatypeProperty',
  },
  'http://www.w3.org/2002/07/owl#Class': {
    color: '#2196f3',
    title: 'owl:Class',
  },
  'http://www.w3.org/2000/01/rdf-schema#Class': {
    color: '#2196f3',
    title: 'rdfs:Class',
  },
  'http://www.w3.org/2002/07/owl#ObjectProperty': {
    color: '#4caf50',
    title: 'owl:ObjectProperty',
  },
  'http://www.w3.org/2002/07/owl#deprecated': {
    color: 'var(--lightrey)',
    title: 'DEPRECATED'
  },
  'http://www.w3.org/2002/07/owl#SymmetricProperty': {
    color: '#673ab7',
    title: 'owl:SymmetricProperty',
  },
  'http://www.w3.org/2002/07/owl#Ontology': {
    color: '#f06292',
    title: 'owl:Ontology',
  },
  'http://www.w3.org/2002/07/owl#AnnotationProperty': {
    color: '#9e9e9e',
    title: 'owl:AnnotationProperty',
  },
  'http://www.w3.org/2002/07/owl#OntologyProperty': {
    color: '#795548',
    title: 'owl:OntologyProperty',
  },
  'http://www.w3.org/2000/01/rdf-schema#Datatype': {
    color: '#00bcd4',
    title: 'rdfs:Datatype',
  },
}
export default {
  components: { Type },
  props: {
    hit: Object,
  },
  computed: {
    term() {
      return this.$route.query.query;
    },
    // TODO: Fix this
    highlightedComment() {
      if (!this.term) { return this.hit._source.comment.en; }
      const replregx = new RegExp(`${this.term}`, 'gi');
      return this.hit._source.comment.en.replace(replregx, `<span class="high">${this.term}</span>`);
    },
    types() {
      return typeof this.hit._source['@type'] === 'string'
        ? [this.hit._source['@type']]
        : this.hit._source['@type']
    },
    deprecated() {
      return !!this.hit._source['@type'].find('owl:deprecated');
    }
  }
}
</script>

<style lang="scss">
  .card {
    border: 4px solid lightgrey;
    border-radius: 2em;
    padding: 1em;

    &.deprecated {
      color: var(--lightgrey);

      .type {
        background: var(--lightgrey) !important;
      }
    }

    & + .card {
      margin-top: 1em;
    }
  }

  .uri {
    word-break: break-word;

    &:hover {
      cursor: pointer;
    }
  }

  .ns-uri {
    white-space: nowrap;
  }

  header {
    font-family: var(--noto-sans);
    margin-bottom: 0.5em;
    border-bottom: 1px solid lightgrey;

    h2 {
      margin: 0.5em 0 0.25em 0;
    }
  }

  article {
    p {
      word-break: break-word;
    }
  }

  .high {
    background: PAPAYAWHIP;
  }
</style>

