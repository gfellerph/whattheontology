<template lang="pug">
  div.add-text-index
    div.index__table
      span 1. Uploading Ontology
      span(v-if="!upload.loading && !upload.response") waiting...
      loading(
        text="uploading"
        v-if="upload.loading"
      )
      a(
        :href="uploadUrl"
        target="_blank"
        v-if="upload.response && !upload.loading"
      ) {{uploadUrl}}
      span.error(
        v-if="upload.error && !upload.loading"
      ) {{upload.error}}
    div.index__table
      span 2. Indexing Ontology
      span(v-if="!index.loading && !index.response") waiting...
      loading(
        text="indexing"
        v-if="index.loading"
      )
      router-link(
        v-if="index.response && !index.loading"
        :to="ontologyUrl"
      ) View Ontology
      span.error(
        v-if="index.error && !index.loading"
      ) {{error}}
    div(
      v-if="upload.response && index.response"
    )
      h2 Total success!
      p Thank you for submitting your ontology. It has been successfully uploaded to your POD and indexed with whattheontology.
      p.text-align-right Happy data linking!
</template>

<script>
import store from '@/store';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  beforeRouteEnter(to, from, next) {
    // Route guard for the indexing step
    if (store.getters.canUpload) {
      next();
    } else {
      next('/add/text/upload');
    }
  },
  async mounted() {
    try {
      await this.UPLOAD_ONTOLOGY();
      await this.INDEX_ONTOLOGY();
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    ...mapState({
      upload: state => state.textInput.upload,
      index: state => state.textInput.index,
    }),
    ...mapGetters([
      'uploadUrl',
    ]),
  },
  methods: {
    ...mapActions([
      'UPLOAD_ONTOLOGY',
      'INDEX_ONTOLOGY',
    ]),
  },
}
</script>

<style>
  .add-text-index {
    margin: 1em auto;
  }

  .index__table {
    display: flex;
    justify-content: space-between;
  }
</style>
