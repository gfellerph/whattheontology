<template lang="pug">
  li.card(
  )
    header
      h2 {{hit._source.label.en}}
      p.small
        span(v-if="isDefinedBy")
          a.ns-uri(
            :href="isDefinedBy"
          ) {{isDefinedBy}}
          span :&nbsp;
        span.italic.lightgrey.uri(
          title="Copy URI"
          v-clipboard="hit._source['@id']"
        ) {{hit._source['@id']}}
    article.box
      p(v-if="hit._source.comment" v-html="hit._source.comment.en")
      p(v-if="hit._source.note" v-html="hit._source.not.en")
      p
        type(
          v-for="(type, index) in hit._source.types"
          :key="index"
          :type="type"
        )
</template>

<script>
import Type from '@/components/Type';

export default {
  components: { Type },
  props: {
    hit: Object,
  },
  computed: {
    term() {
      return this.$route.query.query;
    },
    isDefinedBy() {
      const def = this.hit._source['rdfs:isDefinedBy'];
      return def ? def['@id'] : false;
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
</style>

