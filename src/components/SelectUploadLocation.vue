<template lang="pug">
  div.select-location
    div.line
      span {{origin}}/
      div.input__field
        input(
          id="uploadurl"
          type="url"
          :value="url"
          @input="updateUrl"
        )
        label.hover(for="uploadurl") Ontology URL
    p.text-align-right
      button.small(
        @click="UPLOAD_ONTOLOGY"
      ) Upload
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState({
      url: state => state.textInput.uploadUrl,
    }),
    ...mapGetters([
      'origin'
    ]),
  },
  methods: {
    updateUrl(event) {
      this.$store.commit('SET_UPLOAD_URL', event.target.value);
    },
    ...mapActions([
      'UPLOAD_ONTOLOGY',
    ]),
  },
}
</script>

<style>
  .line {
    display: flex;
  }
</style>
