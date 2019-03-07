<template lang="pug">
  nav
    router-link(:to="{ name: 'home' }") search
    router-link(:to="{ name: 'add' }") add ontology
    router-link(to="/about") about
    a(
      href="https://github.com/tuelsch/whattheontology/issues"
    ) submit an issue
</template>

<style lang="scss" scoped>
  nav {
    text-align: center;

    a {
      text-decoration: none;

      &.router-link-exact-active,
      &.router-link-active {
        color: crimson;
      }

      & + a {
        margin-left: 1em;
      }
    }
  }
</style>
