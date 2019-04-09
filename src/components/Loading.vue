<template lang="pug">
  span.loading {{text}}
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'loading',
    },
  },
}
</script>

<style lang="scss">
  @keyframes loading {
    0% {
      content: '\00a0\00a0\00a0';
    }
    25% {
      content: '.\00a0\00a0';
    }
    50% {
      content: '..\00a0';
    }
    75% {
      content: '...';
    }
  }

  .loading {
    &::after {
      content: '\00a0\00a0\00a0';
      animation: loading 2s infinite;
    }
  }
</style>
