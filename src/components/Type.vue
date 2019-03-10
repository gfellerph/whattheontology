<template lang="pug">
  span.type(
    :class="property.toLowerCase()"
  )
    span.type__namespace {{namespace}}
    span.type__property {{property}}
</template>

<script>
export default {
  props: {
    type: String,
  },
  computed: {
    namespace() {
      return this.type.split(':')[0];
    },
    property() {
      return this.type.split(':')[1];
    }
  }
}
</script>

<style lang="scss" scoped>
  .type {
    display: inline-block;
    border-radius: 50px;
    color: white;
    font-size: 0.85em;
    word-break: keep-all;
    margin-right: 1em;
    margin-top: 0.5em;
    font-family: var(--noto-sans);
    overflow: hidden;
    background-color: var(--lightgrey);

    &.property {
      background-color: #ff5722;
    }
    &.datatypeproperty {
      background-color: #e91e63;
    }
    &.class {
      background-color: #2196f3;
    }
    &.objectproperty {
      background-color: #4caf50;
    }
    &.deprecated {
      background-color: var(--lightrey);
    }
    &.symmetricproperty {
      background-color: #673ab7;
    }
    &.ontology,
    &.ontologyproperty {
      background-color: #f06292;
    }
    &.annotationproperty {
      background-color: #9e9e9e;
    }
    &.datatype {
      background-color: #00bcd4;
    }

    .type__namespace,
    .type__property {
      display: inline-block;
      padding: 0.25em 0.7em;
    }

    .type__property {
      padding-left: 0.35em;
    }

    .type__namespace {
      padding-right: 0.35em;
      background: rgba(255,255,255, 0.4);
      color: rgba(255,255,255,0.8);
    }
  }
</style>
