<template lang="pug">
  div.select-location
    solid-folder-selector(
      :origin="origin"
      v-model="selectedFolder"
    )
    div.input__field
      label(for="ontologyfilename") Filename of your ontology
    div.select-location__filename
      span {{selectedFolder}}
      input(
        id="ontologyfilename"
        type="text"
        v-model="filename"
      )
      span .{{fileEnding}}
    p Your live url: 
      span.live-url(v-clipboard="liveLink" title="Copy to clipboard") {{liveLink}}
    p.text-align-right
      button.small(
        :disabled="!(filename && selectedFolder)"
        @click="upload"
      ) Upload
    div.upload-success(v-if="uploadResponse")
      h2 Upload Success
      p
        span Your ontology is online at 
        a(:href="liveLink" target="_blank") {{liveLink}}
</template>

<script>
import mimeTypes from 'mime-types';
import { mapState, mapActions, mapGetters } from 'vuex';
import SolidFolderSelector from '@/components/SolidFolderSelector';

export default {
  data() {
    return {
      selectedFolder: '',
      filename: '',
    }
  },
  components: {
    SolidFolderSelector,
  },
  computed: {
    ...mapState({
      url: state => state.textInput.uploadUrl,
      rdfType: state => state.textInput.rdfType,
      uploadResponse: state => state.textInput.uploadResponse,
    }),
    ...mapGetters([
      'origin'
    ]),
    liveLink() {
      return `${this.selectedFolder}${this.filename}.${this.fileEnding}`;
    },
    fileEnding() {
      return mimeTypes.extension(this.rdfType);
    }
  },
  methods: {
    upload(event) {
      this.$store.commit('SET_UPLOAD_URL', this.liveLink);
      this.UPLOAD_ONTOLOGY();
    },
    ...mapActions([
      'UPLOAD_ONTOLOGY',
    ]),
  },
}
</script>

<style lang="scss">
  .select-location {
    &__filename {
      display: flex;

      span {
        white-space: nowrap;
      }

      input {
        border-radius: 0;
        border: 1px solid black;
        padding: 0.125em 0.5em;
      }
    }
  }
  .live-url {
    cursor: pointer;
  }
</style>
