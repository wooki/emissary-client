<template>
  <div v-if="report.isLoaded && report.selectedHex" class="area-panel">
    <AreaSummary />
    <!-- <AreaPanelData></AreaPanelData>      
    <AreaPanelItems></AreaPanelItems>       -->
  </div>
</template>

<script setup>
import AreaSummary from './panels/AreaSummary.vue';
import AreaPanelData from './AreaPanelData.vue';
import AreaPanelItems from './AreaPanelItems.vue';

import { useReportStore } from '@/stores/ReportStore';

const report = useReportStore();
</script>

<style scoped></style>
