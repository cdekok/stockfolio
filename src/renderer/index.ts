import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import AppView from "../components/App.vue";
import Autocomplete from "../components/Autocomplete.vue";

"use strict";

const routes = [
  { path: "/", component: Home },
  { path: "/symbol/add", component: Autocomplete }
];

const router = new VueRouter({
  routes
});

Vue.use(VueRouter);
new Vue({
  el: "#app",
  router: router,
  render: r => r(AppView)
});
