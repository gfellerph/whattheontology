<template lang="pug">
  ul.card-list
    card(
      v-for="(card, index) in cards"
      :key="index"
      :card="card"
    )
    li(v-if="cards.length === 0 && !loading")
      h2.lightgrey.italic.blank-slate.center This term does not yet exist (?=
</template>

<script>
import Card from '@/components/Card';

export default {
  components: { Card },
  props: {
    cards: Array,
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
