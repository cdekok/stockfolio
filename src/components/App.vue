<template>
  <div>
    <h1>Stockfolio</h1>
    <router-link to="/">Overview</router-link>
    <router-link to="/symbol/add">Add symbol</router-link>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>

<style lang="scss">
html,
body {
  font-family: Arial, Helvetica, sans-serif;
  background: rgb(32, 31, 31);
  color: rgb(170, 170, 170);
}
a {
  color: rgb(221, 216, 216);
}
</style>
