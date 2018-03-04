<template>
  <div>
      <input type="text" @input="update" v-model="text">
      <ul class="autcomplete-values">
          <li v-for="value in suggestions" :key="value.symbol" @click="select(value)">
              <span class="symbol">{{value.symbol}}</span>
              <span class="name">{{value.name}}</span>
              <span class="exchange">{{value.exch}}</span>
              <span class="exchange-display">{{value.exchDisp}}</span>
              <span class="type">{{value.typeDisp}}</span>
          </li>
      </ul>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Config from "../library/Config";
import Fuse from "fuse.js";
import debounce from "lodash.debounce";

const store = new Config();

async function fetchSymbolData() {
  const url = "https://api.iextrading.com/1.0/ref-data/symbols";
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function getSearch(data: Array<Object>): Fuse {
  return new Fuse(data, {
    shouldSort: true,
    minMatchCharLength: 1,
    tokenize: true,
    matchAllTokens: true,
    threshold: 0.1,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: ["symbol", "name"]
  });
}

export default Vue.extend({
  data: () => {
    return {
      text: "",
      search: getSearch([]),
      suggestions: []
    };
  },
  mounted: function() {
    fetchSymbolData()
      .then(data => (this.search = getSearch(data)))
      .catch(reason => console.error(reason.message));
  },
  methods: {
    select(value: Object) {
      store.addSymbol(value);
      this.close();
      this.$router.push("/");
    },
    update: debounce(function(e: KeyboardEvent) {
      const val = (<HTMLInputElement>e.target).value;
      this.suggestions = this.search.search(val);
    }, 300),
    close(): void {
      this.suggestions = [];
      this.text = "";
    }
  }
});
</script>

<style lang="scss" scoped>
.autcomplete-values {
  margin: 0;
  padding: 0;
  display: block;
  li {
    cursor: pointer;
    list-style: none;
    display: block;
    margin: 0;
    padding: 5px;
    border: 1px solid #ccc;
  }
  span {
    display: inline-block;
    &.symbol {
      font-weight: bold;
    }
  }
}
</style>
