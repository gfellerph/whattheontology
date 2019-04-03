import Vue from 'vue';
import Vuex from 'vuex';
import { auth } from '@/store/auth-store';
import { textInput } from '@/store/text-input-store';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    textInput,
  },
});
