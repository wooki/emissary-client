<template>
  <div class="report">
    <div class="map-container">
      <Map></Map>
    </div>
    <div class="info">
      <AreaPanel v-if="report.selectedHex"></AreaPanel>
    </div>
  </div>
</template>

<script setup>
import Map from './Map.vue';
import AreaPanel from './AreaPanel.vue';
import { useReportStore } from '@/stores/ReportStore';

const report = useReportStore();
</script>

<style scoped>
.report {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 2fr minmax(300px, 1fr);
  height: calc(100vh - var(--header-height));
  max-height: calc(100v- var(--header-height));
  gap: 12px;
  padding: 0 6px 12px 0;
}

.map-container {
  grid-row: 1;
  grid-column: 1;
  position: relative;  
}
.map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.info {
  display: block;
  grid-row: 2;
  grid-column: 1;
  overflow: auto;
}

@media (min-aspect-ratio: 1.2/1) {
  .report {
    grid-template-columns: 2fr minmax(300px, 1fr);
    grid-template-rows: 1fr;
    padding: 0 12px;
  }

  .map-container {
  }

  .info {
    grid-row: 1;
    grid-column: 2;
  }
}
</style>
