<template lang="pug">
  div.add-text-check
    ontology-text-input
    loading(
      v-if="check.loading"
    )
    p.error(
      v-if="check.error"
    ) {{check.error}}
    reporter(
      v-if="check.response"
      :results="check.response"
    )
    hr
    p.text-align-right
      button.small(
        :disabled="!canContinue"
        @click="next"
      ) Next
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import OntologyTextInput from '@/components/OntologyTextInput';
import Reporter from '@/components/Reporter';

export default {
  components: {
    OntologyTextInput,
    Reporter,
  },
  computed: {
    ...mapState({
      check: state => state.textInput.check,
    }),
    canContinue() {
      return !this.check.loading
        && this.check.response
        && !this.check.response.hasErrors;
    }
  },
  methods: {
    next() {
      this.$router.push('/add/text/upload');
    }
  }
}
</script>

<style>

</style>
