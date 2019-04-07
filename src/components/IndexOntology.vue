<template lang="pug">
  div.index-ontology
    p Your ontology is eligible for indexing.
    button(
      @click="INDEX_ONTOLOGY"
    ) index now
</template>

<script>
import { mapState, mapActions } from 'vuex';
import fetchJson from '@/modules/fetch-json';

export default {
  data() {
    return {
      loading: false,
      error: false,
    }
  },
  computed: {
    ...mapState({
      uploadUrl: state => state.textInput.uploadUrl,
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
