<template lang="pug">
  div.url
    form
      div.input__field.has-button
        input(
          id='addontology'
          type='url'
          required
          v-model='url'
          ref='addontology'
          placeholder='http://rdfs.org/sioc/ns#'
        )
        label.hover(for='addontology') Enter the URL to your ontology file
        button(
          @click.prevent='add'
        )
          span Add

    loading(v-if="loading")
    reporter(v-if="response" :results="response")
    div(v-if="error")
      h2 D'oh!
      p.error {{error.message}}
    tipps(v-if="!loading && !response")
</template>

<script>
import Reporter from '@/components/Reporter';
import Tipps from '@/components/Tipps';
export default {
  components: { Reporter, Tipps },
  data() {
    return {
      url: '',
      loading: false,
      error: false,
      response: null,
    };
  },
  mounted() {
    this.$refs.addontology.focus();
  },
  methods: {
    async add() {
      this.response = null;
      this.error = false;
      this.loading = true;
      try {
        const rawResponse = await fetch('/schema', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: this.url,
          }),
        });
        if (!rawResponse.ok) {
          const error = await rawResponse.text();
          throw error;
        }
        const res = await rawResponse.json();
        this.response = res;
        this.url = '';
      } catch (error) {
        this.error = JSON.parse(error);
      }
      this.loading = false;
    }
  }
}
</script>

<style>

</style>
