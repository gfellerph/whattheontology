<template lang="pug">
  div.search-box
    label.sr-only(for="searchinput") Search for predicates, objects, ontologies... try 'name'!
    input.search-input(
      id="searchinput"
      ref="searchinput"
      type="text"
      placeholder="Search for predicates, objects, ontologies... try 'name'!"
      :value="search"
      @input="debouncedEmit"
    )
    p.small.lightgrey.center Try <pre>ns:SOLID</pre> to display all the terms of this namespace
</template>

<script>
import debounce from 'debounce';

export default {
  created() {
    this.debouncedEmit = debounce(this.emitValue, 300);
  },
  mounted() {
    this.$refs.searchinput.focus();
  },
  computed: {
    search() {
      return this.$route.query.search || '';
    }
  },
  methods: {
    emitValue(event) {
      this.$emit('value', event.target.value);
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-box {
    margin: 2em auto;
  }
  
  .search-input {
    display: block;
    width: 100%;
    padding: 1em 2em;
    border-radius: 2em;
    border: 4px solid lightgrey;
    transition: border 100ms;
    font-family: inherit;
    font-size: inherit;

    &:focus {
      border-color: dodgerblue;
      outline: none;
    }
  }
</style>

