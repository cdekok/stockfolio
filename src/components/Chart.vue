<template>
  <div>
      <h1>Chart</h1>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    mounted() {
        console.log(this.$route.params.symbol)
    }
});
</script>

<style lang="scss" scoped>
</style>
