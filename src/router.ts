import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import store from '@/store';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/add',
      name: 'add',
      redirect: '/add/url',
      component: () => import('./views/Add.vue'),
      children: [
        {
          path: 'url',
          name: 'addByUrl',
          component: () => import('./views/add/Url.vue'),
        },
        {
          path: 'text',
          name: 'addByText',
          component: () => import('./views/add/Text.vue'),
          redirect: (to) => {
            if (store.getters.canIndex) { return `${to.fullPath}/index`; }
            if (store.getters.canUpload) { return `${to.fullPath}/upload`; }
            return `${to.fullPath}/check`;
          },
          children: [
            {
              path: 'check',
              name: 'Check',
              component: () => import('@/views/add/text/Check.vue'),
            },
            {
              path: 'upload',
              name: 'Upload',
              component: () => import('@/views/add/text/Upload.vue'),
            },
            {
              path: 'index',
              name: 'Index',
              component: () => import('@/views/add/text/Index.vue'),
            },
          ],
        },
      ],
    },
  ],
});
