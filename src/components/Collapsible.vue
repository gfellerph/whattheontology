<template lang="pug">
  div.collapsible(:class="{ collapsed }")
    header.collapsible__header(@click="collapse")
      slot(name="header")
    slot
</template>

<script>
export default {
  data() {
    return {
      collapsed: true,
    }
  },
  created() {
    this.collapsed = !this.initiallyOpen;
  },
  props: {
    initiallyOpen: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    collapse() {
      this.collapsed = !this.collapsed;
    }
  }
}
</script>


<style lang="scss">
  .collapsible {
    &.collapsed {
      & > .collapsible__header ~ * {
        display: none;
      }
    }
  }
</style>
