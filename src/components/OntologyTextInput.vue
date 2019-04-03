<template lang="pug">
  div.ontology-text-input
    div.input__field
      textarea(
        id="textinput"
        ref="textinput"
        :value="text"
        @input="updateText"
      )
      label.hover(for="textinput") Paste your ontology here
    div.input__field
      select(
        id="choosemimetype"
        @input="updateType"
      )
        option(
          v-for="localType in types"
          :key="localType"
          :value="localType"
          :selected="localType === rdfType"
        ) {{localType}}
      label.hover(for="choosemimetype") Select the mime type for your input
    p.text-align-right
      button.small(
        :disabled="!text"
        @click.prevent="CHECK_ONTOLOGY"
      ) Check
</template>

<script>
import EMimeTypes from '@/../server/schemas/EMimeTypes';
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
  data() {
    return {
      types: EMimeTypes,
    }
  },
  computed: mapState({
    text: state => state.textInput.text,
    rdfType: state => state.textInput.rdfType,
  }),
  mounted() {
    this.$refs.textinput.focus();
  },
  methods: {
    updateText(event) {
      this.$store.commit('SET_TEXT', event.target.value);
    },
    updateType(event) {
      this.$store.commit('SET_TYPE', event.target.value);
    },
    ...mapActions([
      'CHECK_ONTOLOGY'
    ]),
  }
}
</script>

<style>

</style>
