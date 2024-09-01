<template>
  <div class="area-panel-reports">
    <div class="parchment"></div>

    <div v-if="selectedReport" class="area-panel-details">
      <button class="icon" @click="SelectReport(null)"><BackIcon /></button>
      <div class="area-panel-report-title">{{ selectedReport.type }}</div>
      <div
        v-for="(item, itemIndex) in selectedReport.info"
        :key="itemIndex"
        class="area-panel-report-details-row">
        <div class="area-panel-report-details-message">
          <TextEndingWithLink
            :text="item.message"
            @click="SelectArea"
            @mouseenter="HighlightArea"
            @mouseleave="UnhighlightArea" />
        </div>
        <template v-if="item.data">
          <div
            v-for="(dataKey, dataKeyIndex) in Object.keys(item.data)"
            :key="dataKeyIndex"
            class="area-panel-report-details-data">
            <div class="area-panel-report-entry-title">{{ dataKey }}</div>
            <div
              class="area-panel-report-entry-value"
              :class="{
                negative: item.data[dataKey] < 0,
                positive: item.data[dataKey] > 0,
              }">
              {{ item.data[dataKey] }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-else class="area-panel-reports-container">
      <div
        v-for="(report, reportIndex) in aggregateReports"
        :key="reportIndex"
        tabindex="0"
        class="area-panel-report has-details"
        @click="SelectReport(reportIndex)"
        @keypress.enter="SelectReport(reportIndex)">
        <div v-if="report.base != null" class="area-panel-report-base">
          <div class="area-panel-report-title">{{ report.type }}</div>
          <div class="area-panel-report-value">{{ report.base }}</div>
          <div
            v-if="report.adjustment[0] != 0"
            class="area-panel-report-adjustment"
            :class="{ negative: report.adjustment[0] < 0 }">
            {{ report.adjustment[0].toFixed(report.digits) }}
          </div>
        </div>
        <div v-else class="area-panel-report-entries">
          <div class="area-panel-report-title">{{ report.type }}</div>
          <div
            v-for="(entry, entryIndex) in Array.from(report.values.entries())"
            :key="entryIndex"
            class="area-panel-report-entry">
            <div class="area-panel-report-entry-title">{{ entry[0] }}</div>
            <div
              class="area-panel-report-entry-value"
              :class="{ negative: entry[1] < 0, positive: entry[1] > 0 }">
              {{ entry[1] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { AddFloats } from '@/libs/SafeMath.js';
import BackIcon from '@/assets/icons/back.svg';
import TextEndingWithLink from '@/components/TextEndingWithLink.vue';
// import OrderIcon from '@/assets/icons/order.svg';
import { useReportStore } from '@/stores/ReportStore';

const report = useReportStore();

const SelectedHex = computed(() => report.selectedHex);

const selectedReportIndex = ref(null);

const selectedReport = computed(() => {
  if (selectedReportIndex.value == null) return null;

  let reportsArray = Array.from(aggregateReports.value.values());
  return reportsArray[selectedReportIndex.value];
});

const aggregateReports = computed(() => {
  const reports = new Map();

  // one per type and one per store item, iterate and create or update
  let foodReport = null;
  let goodsReport = null;
  let goldReport = null;
  let populationReport = null;

  if (SelectedHex.value.store) {
    foodReport = {
      type: 'FOOD',
      info: [],
      values: new Map(),
      base: SelectedHex.value.store.food,
      adjustment: [0],
      digits: 0,
    };
    goodsReport = {
      type: 'GOODS',
      info: [],
      values: new Map(),
      base: SelectedHex.value.store.goods,
      adjustment: [0],
      digits: 0,
    };
    goldReport = {
      type: 'GOLD',
      info: [],
      values: new Map(),
      base: SelectedHex.value.store.gold,
      adjustment: [0],
      digits: 0,
    };
  }

  if (SelectedHex.value.population) {
    populationReport = {
      type: 'POPULATION',
      info: [],
      values: new Map(),
      base: SelectedHex.value.population.toLocaleString(),
      adjustment: [0],
      digits: 0,
    };
    reports.set('POPULATION', populationReport);
  }

  if (SelectedHex.value.info) {
    SelectedHex.value.info.forEach((info) => {
      reports.set(info.type, CreateOrAddToReport(reports, info, SelectedHex));

      if (foodReport && info.data?.food) {
        foodReport.info.push(info);
        foodReport.adjustment[0] = foodReport.adjustment[0] + info.data.food;
      }

      if (goodsReport && info.data?.goods) {
        goodsReport.info.push(info);
        goodsReport.adjustment[0] = goodsReport.adjustment[0] + info.data.goods;
      }

      if (goldReport && info.data?.gold) {
        goldReport.info.push(info);
        goldReport.adjustment[0] = goldReport.adjustment[0] + info.data.gold;
      }

      if (goldReport && info.data?.cost) {
        goldReport.info.push(info);
        goldReport.adjustment[0] = goldReport.adjustment[0] + info.data.cost;
      }
    });
  }

  if (foodReport) reports.set('FOOD', foodReport);
  if (goodsReport) reports.set('GOODS', goodsReport);
  if (goldReport) reports.set('GOLD', goldReport);

  reports.forEach((report, reportKey, rpts) => {
    const valueKeys = Array.from(report.values.keys());
    if (valueKeys.length == 1) {
      const baseKey = valueKeys[0];
      if (SelectedHex[baseKey] != null) {
        report.base = SelectedHex[baseKey];
        report.adjustment = Array.from(report.values.values());
      }
    }
  });

  return Array.from(reports.values()).toSorted((a, b) => {
    return a.type.localeCompare(b.type);
  });
});

watch(
  () => SelectedHex,
  (newVal, oldVal) => {
    if (newVal?.x != oldVal?.x || newVal?.y != oldVal?.y) {
      SelectReport(selectedReportIndex.value);
    }
  },
  { deep: true },
);

const HighlightArea = (coord) => {
  report.HighlightHex(coord);
};

const UnhighlightArea = () => {
  report.HighlightHex(null);
};

const SelectArea = (area) => {
  report.SelectArea(area);
};

function SelectReport(index) {
  if (selectedReportIndex.value == index) {
    selectedReportIndex.value = null;
  } else {
    selectedReportIndex.value = index;
  }
}

function CreateOrAddToReport(reports, info) {
  let report = {};
  if (reports.has(info.type)) {
    report = reports.get(info.type);
  } else {
    report = {
      type: info.type,
      info: [],
      values: new Map(),
      base: null,
      adjustment: null,
      digits: 2,
    };
  }

  // add info and values
  report.info.push(info);

  if (info.data) {
    Object.keys(info.data).forEach((key) => {
      if (report.values.has(key)) {
        report.values.set(
          key,
          AddFloats(report.values.get(key), info.data[key], 4),
        );
      } else {
        report.values.set(key, info.data[key]);
      }
    });
  }

  return report;
}
</script>

<style scoped></style>
