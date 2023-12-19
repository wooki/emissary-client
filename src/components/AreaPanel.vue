<template>
  <div class="area-panel">
    <AreaPanelSummary :area="area" />

    <div class="area-panel-reports">
      <div v-for="report in aggregateReports" :key="report.source">
        {{ report.type }}<br />
        {{ JSON.stringify(report.info) }}<br />
        {{ JSON.stringify(Array.from(report.values.entries())) }}<br />
        <hr />
      </div>
    </div>

    <div class="area-panel-units">

    </div>

    <!-- <div v-if="area.store" class="store">
      <div class="food">food: {{  area.store.food }}</div>
      <div class="goods">goods: {{  area.store.goods }}</div>
      <div class="gold">gold: {{  area.store.gold }}</div>      
    </div>
    <div v-if="area.wealth" class="wealth">Wealth: {{  area.wealth }}</div>

    <div v-if="area.info">
      <div class="info-item" v-for="(item, itemIndex) in area.info" :key="itemIndex">
        <div class="info-level">{{  item.level }}</div>
        <div class="info-type">{{  item.type }}</div>
        <div class="info-message">{{  item.message }}</div>
        <div class="info-data">{{  JSON.stringify(item.data) }}</div>
      </div>
    </div> -->
    <!-- {{ JSON.stringify(area) }} -->
    
     
    
  </div>
</template>

<script>
import AreaPanelSummary from './AreaPanelSummary.vue'
import { AddFloats } from '@/libs/SafeMath.js'

export default {
  props: {
    area: {
      type: Object,
      required: true
    }
  },
  components: {    
    AreaPanelSummary
  },
  computed: {
    aggregateReports() {
      
      const reports = new Map();

      if (!this.area.info) return [];

      // one per type and one per store item, iterate and create or update
      this.area.info.forEach((info) => {
        reports.set(info.type, this.CreateOrAddToReport(reports, info));
      });      

      return Array.from(reports.values());
    }
  },
  methods: {
    CreateOrAddToReport: (reports, info) => {
      let report = {};
      if (reports.has(info.type)) {
        report = reports.get(info.type);        
      } else {
        report = {
          type: info.type,
          info: [],
          values: new Map()
        }                
      }

      // add info and values
      report.info.push(info);

      Object.keys(info.data).forEach((key) => {
        if (report.values.has(key)) {
          report.values.set(key, AddFloats(report.values.get(key), info.data[key], 4));
        } else {
          report.values.set(key, info.data[key]);
        }        
      });

      return report;
    }
  }
}
</script>

<style scoped>
  .area-panel {
    display: grid;
    grid-template-columns: 1fr 3fr 3fr;       
    grid-template-rows: 1fr; 
    gap: 12px;
    height: 100%;    
  }

  .area-panel-summary {
    min-width: 200px;
    background-color: aqua;
  }

  .area-panel-reports {
    background-color: bisque;
  }

  .area-panel-units {
    background-color: cornflowerblue;
  }

  @media (min-aspect-ratio: 1.2/1) {
    .area-panel {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 3fr 3fr;      
      gap: 24px;
    }
    .area-panel-summary {
      min-width: unset;    
      min-height: 100px;
    }

    .area-panel-info {
      min-height: 150px;
    }

    .area-panel-features {           
      min-height: 150px;          
    }
  }
</style>
