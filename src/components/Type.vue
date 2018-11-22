<template lang="pug">
  span.type(:style="style") {{type.title}}
</template>

<script>
export default {
  props: {
    type: Object,
  },
  computed: {
    style() { return `background: ${this.type.color};`; },
  },
}
</script>

<style lang="scss" scoped>
  .type {
    display: inline-block;
    border-radius: 50px;
    color: white;
    padding: 0.25em 0.5em;
    font-size: 0.85em;
    word-break: keep-all;
    margin-right: 1em;
    margin-top: 0.5em;
    font-family: var(--noto-sans);
  }
</style>
