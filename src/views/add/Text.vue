<template lang="pug">
  div.text
    nav.text__nav
      router-link(to="/add/text/check") 1. Check
      router-link(
        to="/add/text/upload"
        :class="{ enabled: canUpload }"
      ) 2. Upload
      router-link(
        to="/add/text/index"
        :class="{ enabled: canIndex }"
      ) 3. Index
    
    router-view
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'canUpload',
      'canIndex',
    ]),
  },
}
</script>

<style lang="scss">
  .text__nav {
    display: flex;
    justify-content: space-between;
    padding: 1em;
    border-bottom: 1px solid lightgrey;

    a {
      font-weight: bold;
      text-decoration: none;
      color: black;

      &.router-link-active {
        color: dodgerblue;

        & ~ a:not(.enabled) {
          color: lightgrey;
          cursor: default;
          pointer-events: none;
        }
      }
    }
  }
</style>
