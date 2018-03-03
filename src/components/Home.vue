<template>
  <div>
      <h1>Overview</h1>
      <symbols></symbols>
  </div>
</template>

<script lang="ts">
import Symbols from "./Symbols.vue";
import Vue from "vue";

export default Vue.extend({
  components: {
    Symbols
  }
});
</script>

<style lang="scss" scoped>
</style>
