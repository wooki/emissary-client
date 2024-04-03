<template>
  <div class="area-panel">
    <AreaPanelSummary
      :report="report"
      :area="area"
      @updated="Updated"
      @select="SelectArea"
      @highlight="HighlightArea" />
    <AreaPanelData
      :report="report"
      :area="area"
      @updated="Updated"
      @select="SelectArea"
      @highlight="HighlightArea" />
    <AreaPanelItems
      :report="report"
      :area="area"
      @updated="Updated"
      @select="SelectArea"
      @highlight="HighlightArea" />
  </div>
</template>

<script>
import AreaPanelSummary from './AreaPanelSummary.vue';
import AreaPanelData from './AreaPanelData.vue';
import AreaPanelItems from './AreaPanelItems.vue';

export default {
  components: {
    AreaPanelSummary,
    AreaPanelData,
    AreaPanelItems,
  },
  props: {
    report: {
      type: Object,
      required: true,
    },
    area: {
      type: Object,
      required: true,
    },
  },
  emits: ['select', 'updated', 'highlight'],
  methods: {
    HighlightArea(area) {
      this.$emit('highlight', area);
    },
    UnhighlightArea(area) {
      this.$emit('highlight', null);
    },
    Updated(area) {
      this.$emit('updated', area);
    },
    SelectArea(area) {
      this.$emit('select', area);
    },
  },
};
</script>

<style scoped></style>
