<template>
  <div>
    <div>Total:</div>
    <ul class="symbol">
        <li v-for="value in symbols" :key="value.symbol">
          <span class="symbol" @click="select(value)">{{value.symbol}}</span>
          <div class="symbol-data" v-if="value.data">
            <span class="price">{{ value.data.quote.latestPrice}}</span>
            <span class="change">{{ value.data.quote.change}}</span>
            <span class="change-percent">({{ value.data.quote.changePercent }}%)</span>
          </div>
          <button class="delete" @click="remove(value)">delete</button>
        </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Config from "../library/Config";

const config = new Config();

async function fetchData(symbols: Array<string>): Promise<Object> {
  const url =
    "https://api.iextrading.com/1.0/stock/market/batch?displayPercent=true&types=quote&symbols=" +
    symbols.toString();
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

let timer: number | null = null;

export default Vue.extend({
  data() {
    const symbols = config.getSymbols();
    return {
      symbols
    };
  },
  mounted() {
    this.updateData();
    timer = window.setInterval(this.updateData, 10000);
  },
  beforeDestroy: function() {
    if (timer) {
      window.clearInterval(timer);
    }
  },
  methods: {
    select(value: Object) {
      this.$router.push("/chart/" + value.symbol);
    },
    updateData(): void {
      const symbols = this.getSymbols();
      fetchData(symbols).then((data: Object) => {
        for (const symbol in data) {
          this.$set(this.symbols[symbol], "data", data[symbol]);
        }
      });
    },
    remove(value: Object): void {
      config.deleteSymbol(value.symbol);
      this.$delete(this.symbols, value.symbol);
    },
    getSymbols(): Array<string> {
      const symbols = [];
      for (const symbol in this.symbols) {
        symbols.push(symbol);
      }
      return symbols;
    }
  }
});
</script>

<style lang="scss" scoped>
ul.symbol {
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    display: grid;
    grid-gap: 1px;
    grid-template-columns: minmax(0px, 150px) 200px 70px;
    .symbol {
      cursor: pointer;
    }
  }
}
</style>
