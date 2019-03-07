<template lang="pug">
  div.search.container
    search-box(@value="fetchResults")
    card-list(
      v-if="!error && query && !loading"
      :hits="hits"
      :loading="loading"
    )
    p(v-if="loading") loading...
    introduction(v-if="!error && !query && !loading")
    div.container(v-if="error")
      h2 )?=
      p.error Error: {{error}}
</template>

<script>
import router from '@/router';
import CardList from '@/components/CardList';
import SearchBox from '@/components/SearchBox';
import Introduction from '@/components/Introduction';
import search from '@/modules/search';

export default {
  components: {
    SearchBox,
    CardList,
    Introduction,
  },
  data() {
    return {
      hits: [],
      loading: false,
      error: false,
      query: '',
    };
  },
  mounted() {
    // Initially get results if there is a query set
    if (this.$route.query.query) this.fetchResults(this.$route.query.query);
  },
  methods: {
    async fetchResults(query) {
      // Update url in browser
      if (query) { router.push({ query: { query } }); }
      this.query = query;
      if (!query) return;
      this.error = false;
      this.loading = true;

      // Construct api url with search query
      try {
        this.hits = await search(query);
        this.loading = false;
      } catch (error) {
        this.hits = [];
        this.error = error.message;
        this.loading = false;
      }
    },
  },
}
</script>
