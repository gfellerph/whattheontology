<template lang="pug">
  div.upload-success
    h2 Upload successful
    p Your ontology is available at:
    p
      a(
        href="uploadUrl"
        target="_blank"
      ) {{uploadUrl}}
</template>

<script>
export default {
  computed: {
    uploadUrl() {
      return this.$store.state.textInput.uploadUrl;
    },
  },
}
</script>

<style>

</style>
