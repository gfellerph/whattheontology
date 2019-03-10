<template lang="pug">
  nav
    router-link(:to="{ name: 'home' }" exact) search
    router-link(:to="{ name: 'add' }") add ontology
    img.logo(src="@/assets/logo.png")
    router-link(to="/about") about
    a(
      href="https://github.com/tuelsch/whattheontology/issues"
    ) submit an issue
</template>

<style lang="scss" scoped>

  .logo {
    max-height: 20vh;
    margin: 0 2rem;
  }
  
  nav {
    display: flex;
    justify-content: center;
    align-items: center;

    a {
      font-weight: bold;
      text-decoration: none;
      white-space: nowrap;
      &:before {
        content: '/';
      }

      &.router-link-exact-active {
        color: crimson;
        text-decoration: underline;
      }

      & + a {
        margin-left: 1em;
      }
    }
  }
</style>
