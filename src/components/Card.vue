<template lang="pug">
  li.card(
    :style="style"
    :class="{ deprecated: deprecated }"
  )
    header
      h2(v-if="card.label") {{card.label}}
      h2(v-if="card.aclLabel") {{card.aclLabel}}
      h2(v-if="card.title") {{card.title}}
      p.small
        a.ns-uri(
          :href="card.uri"
          v-if="card.isDefinedBy"
        ) {{card.isDefinedBy.title || card.isDefinedBy}}
        span :&nbsp;
        span.italic.lightgrey.uri(
          title="Copy URI"
          v-clipboard="card.uri"
        ) {{card.uri}}
    article.box
      p(v-if="card.comment" v-html="highlightedComment")
      p(v-if="card.dcElementsDescription") {{card.dcElementsDescription}}
      p(v-if="card.dcTermsDescription") {{card.dcTermsDescription}}
      p(v-if="card.note") {{card.note}}
      p
        type(
          v-for="(type, index) in types"
          :key="index"
          :type="type"
        )
</template>

<script>
import Type from '@/components/Type';
const type = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const label = 'http://www.w3.org/2000/01/rdf-schema#label';
const description = 'http://purl.org/dc/elements/1.1/description';
const title = 'http://purl.org/dc/elements/1.1/title';
const comment = 'http://www.w3.org/2000/01/rdf-schema#comment';
const ontology = 'http://www.w3.org/2002/07/owl#Ontology';
const owlDeprecated = 'http://www.w3.org/2002/07/owl#deprecated';
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
    card: Object,
  },
  computed: {
    term() {
      return this.$route.query.search;
    },
    // TODO: Fix this
    highlightedComment() {
      if (!this.term) { return this.card.comment; }
      const replregx = new RegExp(`${this.term}`, 'gi');
      return this.card.comment.replace(replregx, `<span class="high">${this.term}</span>`);
    },
    style() {
      if (this.deprecated) { return `border-color: lightgrey;`; }
      const rdfType = this.card.statements.filter((statement) => statement.predicate === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
      const color = rdfType.reduce((acc, t) => colorCodes[t.object], {}) || { color: 'lightgrey' };
      return `border-color:${color.color}`;
    },
    types() {
      return this.card.statements
        .filter((statement) => statement.predicate === type && colorCodes[statement.object])
        .map((statement) => colorCodes[statement.object]);
    },
    deprecated() {
      return !!this.card.statements
        .filter((statement) => statement.predicate === owlDeprecated)
        .length;
    }
  }
}
</script>

<style lang="scss" scoped>
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
    background: lighten($color: lightgreen, $amount: 20);
  }
</style>

