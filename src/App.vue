<template lang="pug">
  div#app
    navigation
    keep-alive
      router-view
    footer.footer
      p.small.italic.lightgrey.center
        span created by Philipp Gfeller, 
        span released under the MIT licence, 
        a(href="https://github.com/tuelsch/whattheontology") project on github
</template>

<script>
export default {
  mounted() {
    document.addEventListener('keypress', this.keypress, false);
  },
  methods: {
    keypress(event) {
      // TODO: Figure out best combination to enable s+? for go to search
    }
  }
}
</script>
