<template lang="pug">
  div.solid-folder-selector
    header.solid-folder-selector__header
      h4.solid-folder-selector__title POD: {{origin}}
      nav.solid-folder-selector__breadcrumbs
        a.root(
          href="#"
          @click.prevent="goHome"
        ) Home
        a(
          href="#"
          v-for="segment in folderPath"
          :key="segment.url"
          @click.prevent="navigateUp(segment)"
        ) {{segment.name}}
    ol.solid-folder-selector__folder-list
      li(
        v-for="folder in folders"
        :key="folder.url"
        @dblclick="navigateDeeper(folder)"
      )
        label(
          :for="folder.name"
        )
          input(
            :id="folder.name"
            type="radio"
            name="selectedUrl"
            v-model="selectedUrl"
            :value="folder.url"
          )
          span {{folder.name}}
      li.solid-folder-selector__new-folder(v-if="addFolderMode")
        input(
          id="addnewfolder"
          type="text"
          @keypress.enter="addFolder"
          v-model="newFolderName"
        )
        label(for="addnewfolder") Folder name, press [Enter] to add
    p.solid-folder-selector__blank-slate.solid-folder-selector__info(v-if="!folders.length && !loading") No subfolders at this path
    p.solid-folder-selector__info(v-if="loading")
      loading
    p.error(v-if="error") {{error}}
    p.error(v-if="createFolderError") {{createFolderError}}
    p.error(v-if="deleteFolderError") {{deleteFolderError}}
    div.solid-folder-selector__controls
      button(
        @click="toggleAddFolderMode"
      )
        img(src="/img/folder-add.svg")
        span Add folder
</template>

<script>
const fileClient = SolidFileClient;
export default {
  data() {
    return {
      selectedUrl: '',
      folders: [],
      folderPath: [],
      loading: false,
      error: false,
      addFolderMode: false,
      newFolderName: '',
      createFolderError: false,
      deleteFolderError: false,
      currentUrl: '',
    }
  },
  props: {
    origin: String,
  },
  model: {
    event: 'change',
  },
  mounted() {
    this.loadFolder(this.origin);
    document.addEventListener('keydown', this.deleteFolder, false);
  },
  beforeDestroyed() {
    document.removeEventListener('keydown', this.deleteFolder);
  },
  watch: {
    selectedUrl(newUrl) {
      let folderUrl = newUrl;
      if (!folderUrl.endsWith('/')) folderUrl += '/';
      this.$emit('change', folderUrl);
    }
  },
  methods: {
    async loadFolder(url) {
      this.selectedUrl = url;
      this.loading = true;
      this.folders = [];
      this.error = false;
      try {
        const contents = await fileClient.readFolder(url);
        this.folders = contents.folders;
        this.currentUrl = url;
      } catch (error) {
        this.error = error.message;
      }
      this.loading = false;
    },
    navigateUp(folder) {
      this.folderPath = this.folderPath.filter((segment) => {
        return segment.url.length <= folder.url.length;
      });
      this.loadFolder(folder.url);
    },
    navigateDeeper(folder) {
      this.folderPath.push(folder);
      this.loadFolder(folder.url);
    },
    toggleAddFolderMode() {
      this.addFolderMode = !this.addFolderMode;
    },
    async addFolder() {
      this.createFolderError = false;
      this.loading = true;
      try {
        await fileClient.createFolder(`${this.currentUrl}/${this.newFolderName}`);
        this.newFolderName = '';
        this.addFolderMode = false;
        this.loadFolder(this.currentUrl);
      } catch (error) {
        this.createFolderError = error.message;
      }
      this.loading = false;
    },
    async deleteFolder(event) {
      if (event.key && event.key.toLowerCase() !== 'delete') return;
      if (!this.selectedUrl) return;
      this.deleteFolderError = false;
      const url = this.selectedUrl;
      const canDelete = confirm(`Do you want to delete the folder at ${url}?`);
      if (!canDelete) return;
      try {
        await fileClient.deleteFolder(url);
        this.folders = this.folders.filter((folder) => folder.url !== url);
        this.selectedUrl = this.folderPath[this.folderPath.length - 1].url;
      } catch (error) {
        console.error('Cant delete', error);
        this.deleteFolderError = error.message;
      }
    },
    goHome() {
      this.folderPath = [];
      this.loadFolder(this.origin);
    }
  }
}
</script>

<style lang="scss">
  .solid-folder-selector {
    border-radius: 2rem;
    border: 4px solid dodgerblue;
    overflow: hidden;

    & > *:first-child {
      margin-top: 0;
    }

    & > *:last-child {
      margin-bottom: 0;
    }

    &__title {
      padding: 1em;
      background: dodgerblue;
      color: white;
      margin: 0;
    }

    &__breadcrumbs {
      padding: 0.5em 1em;
      border-bottom: 4px solid lightgrey;

      a + a {
        margin-left: 0.5em;
        &:before {
          content: '>';
          margin-right: 0.5em;
          text-decoration: none;
          color: black;
        }
      }
    }

    &__folder-list {
      list-style: none;
      padding-left: 0;
      margin: 0;
      padding: 1em 0;

      li {
        position: relative;

        &:before {
          content: url(/img/folder-simple.svg);
          position: absolute;
          left: 1em;
          top: 3px;
          display: inline-block;
          width: 1.25em;
        }

        input[type="radio"] {
          position: absolute;
          opacity: 0;
          visibility: hidden;
        }

        input:checked + span {
          background-color: lightskyblue;
        }

        span {
          display: block;
          padding: 0 1em 0 3em;
        }
      }
    }

    &__controls {
      background: lightgrey;
      border-top: 1px solid grey;
      padding: 0.5em 1em;

      button {
        border: none;
        background: dodgerblue;
        color: white;
        display: flex;
        padding: 0.25em 1em;

        img {
          margin-right: 0.5em;
          height: 1.2em;
          margin: 0.2em 0.5em 0.2em 0;
          display: block;
        }
      }
    }

    &__new-folder {
      padding: 0 1em 0 3em;

      input {
        border: 1px solid black;
        padding: 0.125em 0.5em;
        border-radius: 0;
      }
      label {
        font-size: 0.75em;
        color: grey;
      }
    }

    &__info {
      background: gold;
      padding: 0.125em 1em;
      margin-bottom: 0;
    }
  }

  .solid-folder-selector__folder-list {
    height: 200px;
    overflow: auto;
  }
</style>
