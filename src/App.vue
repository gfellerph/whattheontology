<template lang="pug">
  div#app
    h1 What the ont***gy <sup>[alpha]</sup>
    navigation
    router-view
    footer.footer
      p.small.italic.lightgrey.center
        span Copyright © 2018 Philipp Gfeller, 
        span released under the MIT licence, 
        a(href="https://github.com/tuelsch/whattheontology") project on github
</template>

<style lang="scss">
$lightgrey: rgb(180,180,180);
$anthracite: #303030;
* {
  box-sizing: border-box;
}

body {
  // Prevent page jumping between searches
  overflow-y: scroll;
  --lightgrey: rgb(180,180,180);
  --noto-sans: 'Noto Sans SC', Helvetica, Arial, sans-serif;
  margin: 0;
  font-family: Helvetica, Arial, sans-serif;
  letter-spacing: -.00278rem;
  line-height: 1.6;
  word-spacing: -0.05rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $anthracite;
}

#app {
  margin: 0 1em;
}

.footer {
  margin-top: 2em;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--noto-sans);
}

h1 {
  text-align: center;
}

a {
  color: inherit;
}

p pre {
  display: inline-block;
}

.center { text-align: center; }
.small { font-size: 0.85em; }
.lightgrey { color: $lightgrey; }
.italic { font-style: italic; }
.error { color: crimson; }

.container {
  max-width: 600px;
  margin-right: auto;
  margin-left: auto;
}

.box {
  > *:first-child { margin-top: 0; }
  > *:last-child { margin-bottom : 0; }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}
</style>
