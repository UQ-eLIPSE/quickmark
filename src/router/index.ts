import Vue from "vue";
import Router from "vue-router";
import Home from "../components/Home.vue";
import Viewer from "../components/Viewer.vue";

Vue.use(Router);


export default new Router({
    routes: [
     {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: '/viewer',
        name: 'viewer',
        component: Viewer,
        props: {
          fileIndex: undefined
        }
      }
    ]
  })