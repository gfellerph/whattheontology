<template lang="pug">
  div.login
    p logged in: {{authenticated}}
      span(v-if="authenticated") ({{webID}})
    p(v-if="!authenticated")
      button.small(@click="POPUP_LOGIN") login
    p(v-if="authenticated")
      button.small(@click="LOGOUT") logout
    p(v-if="errorMessage") {{errorMessage}}
</template>

<script>
import router from '@/router';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      errorMessage: '',
    }
  },
  mounted() {
    // Try to log in any existing user
    this.AUTO_LOGIN();
  },
  computed: {
    webID() { return this.session ? this.session.webId : ''; },
    ...mapState({
      session: state => state.auth.session,
    }),
    ...mapGetters(['authenticated']),
  },
  methods: {
    ...mapActions([
      'AUTO_LOGIN',
      'POPUP_LOGIN',
      'LOGOUT',
    ]),
  }
}
</script>

<style lang="scss" scoped>

</style>
