<template lang="pug">
  div.reporter
    h2
      span(v-if="results.hasErrors") Ontology contains errors
      span(v-else) Ontology looks good
      span(v-if="results.hasRecommendations") , but has recommendations
    p(v-if="results.indexed") Indexed {{results.elasticResponse.items.length}} properties of {{results.url}} successfully
    collapsible(
      v-if="results.failed"
      :initiallyOpen="true"
    )
      h3.h5(slot="header") Failed {{results.failed}} of {{results.totalChecks}} checks
      ul.errors.reporter__list
        li(
          v-for='(check, index) in failedChecks'
          :key="index"
        )
          collapsible
            template(slot="header")
              span [X] 
              span.bold {{check.title}} 
              span ({{check.level}})
            article(v-html="check.description")
            collapsible
              h4.h6(slot="header") Error details
              article.error-details
                p(
                  v-for='detail, errorIndex in check.errors'
                  :key="errorIndex"
                ) {{detail.message}} at {{detail.dataPath}}
    collapsible(v-if="results.passed")
      h3.h5(slot="header") Passed {{results.passed}} of {{results.totalChecks}} checks
      ul.reporter__list
        li(
          v-for="check, index in passedChecks"
          :key="index"
        )
          collapsible
            template(slot="header")
              span [✓] 
              span.bold {{check.title}} 
              span ({{check.level}})
              span.collapsible__indicator
            article(v-html="check.description")
</template>

<script>
export default {
  props: {
    results: Object,
  },
  computed: {
    passedChecks() {
      if (!this.results || !this.results.checks) return [];
      return this.results.checks.filter((check) => !check.errors);
    },
    failedChecks() {
      if (!this.results || !this.results.checks) return [];
      return this.results.checks.filter((check) => check.errors);
    },
  },
}
</script>

<style lang="scss">
  .collapsible__header {
    cursor: pointer;
    position: relative;

    &:after {
      position: absolute;
      top: 0;
      right: 0;
      content: '[-]';
    }

    .collapsible.collapsed >  & {
      &:after {
        content: '[+]';
      }
    }
  }

  .reporter__list {
    list-style: none;
  }

  .error-details {
    background: lightgrey;
    padding: 0.5rem;
    overflow: auto;

    p {
      margin: 0 auto;
      white-space: nowrap;
    }
  }
</style>

