<template lang="pug">
  ul.card-list
    card(
      v-for="(hit, index) in hits"
      :key="index"
      :hit="hit"
    )
    li(v-if="hits.length === 0 && !loading")
      h2.lightgrey.italic.blank-slate.center This term is not indexed yet (?=
</template>

<script>
import Card from '@/components/Card';

export default {
  components: { Card },
  props: {
    hits: Array,
    loading: Boolean,
  },
}
</script>

<style lang="scss" scoped>
  .card-list {
    list-style: none;
    padding-left: 0;
    max-width: 600px;
    margin: 2em auto;
  }

  .blank-slate {
    margin: 4em 0;
  }
</style>
