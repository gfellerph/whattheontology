<template lang="pug">
  div.add.container
    nav.tabs
      router-link(to="/add/url") by URL
      router-link(to="/add/text") by text input
    router-view
</template>

<script>
export default {
  name: 'Add',
}
</script>

<style lang="scss">
  .tabs {
    border-bottom: 1px solid lightgrey;
    margin: 1em 0;

    a {
      display: inline-block;
      padding: 0.25rem 1rem;
      border: 1px solid lightgrey;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      margin: 0 0.25rem -1px 0;
      font-weight: bold;
      text-decoration: none;
  
      &.router-link-active {
        border-bottom-color: white;
        color: crimson;
      }
    } 
  } 
</style>
