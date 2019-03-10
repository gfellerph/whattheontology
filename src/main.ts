import Vue from 'vue';
import Clipboard from 'v-clipboard';
import Collapsible from '@/components/Collapsible.vue';
import Loading from '@/components/Loading.vue';
import App from './App.vue';
import router from './router';
import Navigation from './components/Navigation.vue';
import '@/styles/_index.scss';

Vue.component('navigation', Navigation);
Vue.component('loading', Loading);
Vue.use(Clipboard);
Vue.component('collapsible', Collapsible);
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
