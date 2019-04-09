<template lang="pug">
  div.add-text-upload
    solid-login(
      v-if="!authenticated"
    )
    select-upload-location(
      v-if="authenticated"
    )
    p.text-align-right
      button.small(
        :disabled="!canUpload"
        @click="goNext"
      ) Upload
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import store from '@/store';
import SelectUploadLocation from '@/components/SelectUploadLocation';
import SolidLogin from '@/components/SolidLogin';
import UploadSuccess from '@/components/UploadSuccess';

export default {
  components: {
    SelectUploadLocation,
    SolidLogin,
    UploadSuccess,
  },
  beforeRouteEnter(to, from, next) {
    // Check if prerequisites for this route are fullfilled, else redirect to the first
    // step of the form
    if (store.getters.checkSuccessful) {
      next();
    } else {
      next('/add/text/check');
    }
  },
  computed: {
    ...mapState({
      upload: state => state.textInput.upload,
    }),
    ...mapGetters([
      'authenticated',
      'canUpload',
    ]),
  },
  methods: {
    goNext() {
      this.$router.push('/add/text/index');
    }
  }
}
</script>

<style lang="scss">

</style>
