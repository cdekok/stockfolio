<template>
  <div>
      <h1>{{ symbol }}</h1>
      <select v-model="range" @input="chartRange">
        <option v-for="option in ranges" :key="option" v-bind:value="option">
          {{ option }}
        </option>
      </select>
      <svg id="stock-chart"
       width="600"
       height="200"></svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as d3 from "d3";
import { Event } from "electron";

async function fetchData(symbol: string, range: string = "1d"): Promise<any> {
  const url =
    "https://api.iextrading.com/1.0/stock/market/chart?types=quote&symbols=" +
    symbol +
    "&range=" +
    range;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export default Vue.extend({
  data() {
    return {
      range: '1d',
      ranges: [
        '1d',
        '1m',
        '3m',
        '1y',
        '2y',
        '5y',
      ],
      symbol: ""
    };
  },
  mounted() {
    const symbol: string = this.$route.params.symbol;
    this.symbol = symbol;
    fetchData(symbol)
      .then(data => {
        this.drawChart(data[0]);
      })
      .catch(error => console.error(error));
  },
  methods: {
    chartRange(e:Event):void {
      const range = (<HTMLSelectElement>e.target).value;
      fetchData(this.symbol, range)
      .then(data => {
        this.drawChart(data[0]);
      })
      .catch(error => console.error(error));
    },
    parseDateTime(value:any):string {
      const parseTime = d3.timeParse("%H:%M");
      const parseDate = d3.timeParse("%Y-%m-%d");
      let time = parseDate(value.date);
      if (value.minute) {
        time = parseTime(value.minute);
      }
      return time;
    },
    drawChart(data: any) {
      const svg = d3.select(this.$el.querySelector("#stock-chart"));
      svg.selectAll('*').remove();
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const width = +svg.attr("width") - margin.left - margin.right;
      const height = +svg.attr("height") - margin.top - margin.bottom;
      const g = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const x = d3.scaleTime().rangeRound([0, width]);
      const y = d3.scaleLinear().rangeRound([height, 0]);

      const line = d3
        .line()
        .x((d: any): any => {
          return x(this.parseDateTime(d));
        })
        .y((d:any) => {
          if (d.marketAverage) {
            return y(d.marketAverage);
          }
          return y(d.close);
        });

      x.domain(
        d3.extent(data, (d: any): string => {
          return this.parseDateTime(d);
        })
      );
      y.domain(
        d3.extent(data, (d: any): string => {
          if (d.marketAverage) {
            return d.marketAverage;
          }
          return d.close;
        })
      );

      g
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x-axis")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

      g
        .append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#ccc")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

      g
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    }
  }
});
</script>

<style lang="scss">
svg {
  margin: 25px;
  color: #ccc;
  path {
    fill: none;
    stroke: #76bf8a;
    stroke-width: 3px;
  }

  text {
    fill: #fff;
  }
  line,
  .domain {
    stroke: #fff;
  }
  .x-axis path {
    stroke: #fff;
  }
}
</style>
