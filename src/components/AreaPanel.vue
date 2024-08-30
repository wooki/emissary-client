<template>
  <div v-if="report.isLoaded && report.selectedHex" class="area-panel">
    <AreaSummary />
    <AreaData />
    <AreaPanelItems></AreaPanelItems>
  </div>
</template>

<script setup>
import AreaSummary from './panels/AreaSummary.vue';
import AreaData from './panels/AreaData.vue';
import AreaPanelItems from './AreaPanelItems.vue';

import { useReportStore } from '@/stores/ReportStore';

const report = useReportStore();
</script>

<style scoped></style>
