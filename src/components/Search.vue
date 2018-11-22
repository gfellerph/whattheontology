<template lang="pug">
  div.search.container
    search-box(@value="fetchResults")
    card-list(
      v-if="!error && search"
      :cards="results"
      :loading="loading"
    )
    introduction(v-if="!error && !search")
    div.container(v-if="error")
      h2 )?=
      p.error Error: {{error}}
</template>

<script>
import router from '@/router';
import CardList from '@/components/CardList';
import SearchBox from '@/components/SearchBox';
import Introduction from '@/components/Introduction';

export default {
  components: {
    SearchBox,
    CardList,
    Introduction,
  },
  data() {
    return {
      results: [],
      loading: false,
      error: false,
      search: '',
    };
  },
  created() {
    // Initially get results if there is a query set
    this.fetchResults(this.$route.query.search || '');
  },
  methods: {
    async fetchResults(search) {
      // Update url in browser
      if (search) { router.push({ query: { search } }); }
      this.search = search;
      this.error = false;
      this.loading = true;

      // Construct api url with search query
      const url = new URL(`${window.location.origin}/search`);
      url.search = new URLSearchParams({ search });
      fetch(url)
        .then(async (response) => {
          this.loading = false;
          const json = await response.json();
          if (response.ok) {
            return json;
          } else {
            throw json;
          }
        })
        .then((json) => {
          this.results = json;
        })
        .catch((error) => {
          this.error = error.message;
        });
    },
  },
}
</script>
