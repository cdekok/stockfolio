<template>
    <ul>
        <li v-for="value in symbols" :key="value.symbol">
            <span @click="select(value)">{{value.symbol}}</span>
            <div v-if="value.data">
              <span class="price">{{ value.data.quote.latestPrice}}</span>
              <span class="change">{{ value.data.quote.change}}</span>
              <span class="change-percent">({{ value.data.quote.changePercent}}%)</span>
            </div>
            <button class="delete" @click="remove(value)">delete</button>
        </li>
    </ul>
</template>

<script lang="ts">
import Vue from "vue";
import Config from "../library/Config";

const config = new Config();

async function fetchData(symbols: Array<string>): Promise<Object> {
  const url =
    "https://api.iextrading.com/1.0/stock/market/batch?types=quote&symbols=" +
    symbols.toString();
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

let timer: number | null = null;

export default Vue.extend({
  data: () => {
    const symbols = config.getSymbols();
    return {
      symbols
    };
  },
  mounted: function() {
    this.updateData();
    timer = window.setInterval(this.updateData, 10000);
  },
  beforeDestroy: function() {
    if (timer) {
      window.clearInterval(timer);
    }
  },
  methods: {
    select() {},
    updateData(): void {
      const symbols = this.getSymbols();
      fetchData(symbols).then((data: Object) => {
        console.log(data)
        for (const symbol in data) {
          this.$set(this.symbols[symbol], 'data', data[symbol]);
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
</style>
