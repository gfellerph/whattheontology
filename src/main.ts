import Vue from 'vue';
import Vuex from 'vuex';
import Clipboard from 'v-clipboard';
import Collapsible from '@/components/Collapsible.vue';
import Loading from '@/components/Loading.vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Navigation from './components/Navigation.vue';
import '@/styles/_index.scss';

Vue.component('navigation', Navigation);
Vue.component('loading', Loading);
Vue.use(Clipboard);
Vue.use(Vuex);
Vue.component('collapsible', Collapsible);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
