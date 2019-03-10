<template lang="pug">
  span.loading loading
</template>

<style lang="scss">
  @keyframes loading {
    0% {
      content: '';
    }
    25% {
      content: '.';
    }
    50% {
      content: '..';
    }
    75% {
      content: '...';
    }
  }

  .loading {
    &::after {
      content: '';
      animation: loading 2s infinite;
    }
  }
</style>
