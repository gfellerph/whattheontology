<template lang="pug">
  div.search-box
    div.input__field
      input.search-input(
        id="searchinput"
        ref="searchinput"
        type="text"
        :value="search"
        @input="debouncedEmit"
      )
      label.hover(for="searchinput") Search for something... try 'name'!
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
      return this.$route.query.query || '';
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
</style>

