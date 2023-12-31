<template>
  <div class="area-panel">
    <AreaPanelSummary :area="area" />

    <div class="area-panel-reports">
      <div class="parchment"></div>

      <div class="area-panel-reports-container">
        <div tabindex="0" @click="SelectReport(reportIndex)" @keypress.enter="SelectReport(reportIndex)" v-for="(report, reportIndex) in aggregateReports" :key="reportIndex" class="area-panel-report">

          <div v-if="report.base != null" class="area-panel-report-base">
            <div class="area-panel-report-title">{{ report.type }}</div>
            <div class="area-panel-report-value">{{  report.base }}</div>
            <div v-if="report.adjustment[0] != 0" class="area-panel-report-adjustment" :class="{negative: report.adjustment[0] < 0}">{{  report.adjustment[0].toFixed(2) }}</div>
          </div>
          <div v-else class="area-panel-report-entries">
            <div class="area-panel-report-title">{{ report.type }}</div>
            <div class="area-panel-report-entry" v-for="(entry, entryIndex) in Array.from(report.values.entries())" :key="entryIndex">
              <div class="area-panel-report-entry-title">{{ entry[0] }}</div>
              <div class="area-panel-report-entry-value" :class="{negative: entry[1] < 0, positive: entry[1] > 0}">{{ entry[1] }}</div>
            </div>
          </div>                    
        </div>
      </div>

      <div v-if="selectedReport" class="area-panel-details">
        <div class="area-panel-report-title">{{ selectedReport.type }}</div>
        <div class="area-panel-report-details-row" v-for="(item, itemIndex) in selectedReport.info" :key="itemIndex">
            <div class="area-panel-report-details-type">{{ item.type }}</div>
            <div class="area-panel-report-details-message">{{ item.message }}</div>
            <div class="area-panel-report-details-data" v-for="(dataKey, dataKeyIndex) in Object.keys(item.data)" :key="dataKeyIndex">
              <div class="area-panel-report-entry-title">{{ dataKey }}</div>
              <div class="area-panel-report-entry-value">{{ item.data[dataKey] }}</div>
            </div> 
          </div>  
      </div>
    </div>

    <div class="area-panel-units">
      <div class="parchment"></div>

    </div>    
     
    
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
  data: function() {
    return {
      selectedReportIndex: null
    };
  },  
  components: {    
    AreaPanelSummary
  },
  computed: {
    selectedReport() {
      if (this.selectedReportIndex == null) return null;

      let reportsArray = Array.from(this.aggregateReports.values());
      return reportsArray[this.selectedReportIndex];
    },
    aggregateReports() {
      
      const reports = new Map();

      if (!this.area.info) return [];

      // one per type and one per store item, iterate and create or update
      this.area.info.forEach((info) => {
        reports.set(info.type, this.CreateOrAddToReport(reports, info, this.area));
      });     
      
      reports.forEach((report, reportKey, rpts) => {

        const valueKeys = Array.from(report.values.keys());
        if (valueKeys.length == 1) {
          const baseKey = valueKeys[0];
          if (this.area[baseKey] != null) {
            report.base = this.area[baseKey];
            report.adjustment = Array.from(report.values.values());
          }      
        }
      });

      return Array.from(reports.values());
    }
  },
  methods: {
    SelectReport(index) {
      if (this.selectedReportIndex == index) {
        this.selectedReportIndex = null;
      } else {
        this.selectedReportIndex = index;
      }
    },
    CreateOrAddToReport(reports, info) {
      let report = {};
      if (reports.has(info.type)) {
        report = reports.get(info.type);        
      } else {
        report = {
          type: info.type,
          info: [],
          values: new Map(),
          base: null,
          adjustment: null
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
    position: relative;
    min-width: 200px;
    background-color: transparent;    
    color: var(--color-text);
  }

  .area-panel-reports {
    position: relative;
    z-index: 1;
    background-color: transparent;    
    color: var(--color-text);
  }

  .area-panel-units {
    position: relative;
    z-index: 1;
    background-color: transparent;    
    color: var(--color-text);
  }

  .area-panel-reports-container {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    padding: 7px 7px;
  }

  .area-panel-report {
    flex: 1 1 80px;
    max-width: 120px;
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
    border-radius: 2px;
    border: 1px solid transparent;    
    transition: all 100ms ease;
  }
  .area-panel-report:hover, .area-panel-report:focus-visible {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--color-text);
  }

  .area-panel-report-title {
    font-weight: bold;
  }

  .area-panel-report-base {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 5px;    

    .area-panel-report-title {
      width: 100%;
    }
    
    .area-panel-report-value {
      font-size: 28px;
      line-height: 1;      
    }
    .area-panel-report-adjustment {
      font-family: 'Courier New', Courier, monospace;
      line-height: 1.4;
      color: var(--color-green);
      &::before {
        content: "+"
      }
      &.negative {
        color: var(--color-red);  
        &::before {
        content: ""
      }
      }
    }
  }

  .area-panel-report-entry {
    display: grid;
    grid-template-columns: 3fr 2fr;

    .area-panel-report-entry-value {
      font-family: 'Courier New', Courier, monospace;
      text-align: right;
      line-height: 1.3;
      &.positive {
        color: var(--color-green);
        &::before {
          content: "+"
        }
      }
      &.negative {
        color: var(--color-red);  
        &::before {
        content: ""
      }
      }
    }
  }

  @media (min-aspect-ratio: 1.2/1) {
    .area-panel {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 3fr 3fr;      
      gap: 12px;
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
