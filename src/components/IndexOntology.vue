<template lang="pug">
  div.index-ontology
    h2 Congratulations
    p Your ontology is eligible for indexing.
    p.text-align-right
      button.small(
        @click="INDEX_ONTOLOGY"
      ) index now
</template>

<script>
import { mapState, mapActions } from 'vuex';
import fetchJson from '@/modules/fetch-json';

export default {
  computed: {
    ...mapState({
      uploadUrl: state => state.textInput.uploadUrl,
      index: state => state.textInput.index,
    }),
  },
  methods: {
    ...mapActions([
      'INDEX_ONTOLOGY',
    ]),
  },
}
</script>

<style>

</style>
