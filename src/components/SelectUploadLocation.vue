<template lang="pug">
  div.select-location
    solid-folder-selector(
      :origin="origin"
      @change="SET_FOLDER_PATH"
    )
    div.input__field
      div.select-location__filename.input
        span.select-location__origin {{folderpath}}
        input(
          id="ontologyfilename"
          type="text"
          :value="filename"
          @input="setFileName"
        )
        span .{{fileEnding}}
        label.hover(for="ontologyfilename") Filename of your ontology
</template>

<script>
import mimeTypes from 'mime-types';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import SolidFolderSelector from '@/components/SolidFolderSelector';

export default {
  components: {
    SolidFolderSelector,
  },
  computed: {
    ...mapState({
      url: state => state.textInput.uploadUrl,
      rdfType: state => state.textInput.rdfType,
      filename: state => state.textInput.fileName,
      folderpath: state => state.textInput.folderPath,
    }),
    ...mapGetters([
      'origin',
      'canIndex',
    ]),
    fileEnding() {
      return mimeTypes.extension(this.rdfType);
    }
  },
  methods: {
    ...mapMutations([
      'SET_FOLDER_PATH',
      'SET_FILENAME',
    ]),
    setFileName(event) {
      this.SET_FILENAME(event.target.value);
    },
  },
}
</script>

<style lang="scss">
  .select-location {
    &__filename {
      display: flex;
      justify-content: flex-end;
      overflow: hidden;

      span {
        white-space: nowrap;
      }

      input {
        border-radius: 0;
        border: 1px solid black;
        padding: 0.125em 0.5em;
        min-width: 8em;
      }
    }
  }
  .live-url {
    cursor: pointer;
  }
</style>
