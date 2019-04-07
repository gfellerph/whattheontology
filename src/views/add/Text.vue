<template lang="pug">
  div.text
    h2 1. Paste and check your ontology
    ontology-text-input
    reporter(v-if="response" :results="response")

    h2 2. Log into your solid account
    solid-login(v-if="response && !response.hasErrors")

    h2 3. Select upload location and upload
    select-upload-location(v-if="response && authenticated")

    h2 4. Indexing your ontology
    index-ontology
</template>

<script>
import EMimeTypes from '@/../server/schemas/EMimeTypes';
import Reporter from '@/components/Reporter';
import SolidLogin from '@/components/SolidLogin';
import OntologyTextInput from '@/components/OntologyTextInput';
import IndexOntology from '@/components/IndexOntology';
import SelectUploadLocation from '@/components/SelectUploadLocation';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    Reporter,
    IndexOntology,
    SolidLogin,
    OntologyTextInput,
    SelectUploadLocation,
  },
  computed: {
    ...mapState({
      loading: state => state.textInput.loading,
      error: state => state.textInput.error,
      response: state => state.textInput.response,
    }),
    ...mapGetters(['authenticated'])
  },
}
</script>

<style>
  textarea {
    resize: vertical;
    min-height: 50vh;
  }
</style>
