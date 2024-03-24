<template>
  <div class="area-panel">
    <AreaPanelSummary @updated="Updated" :report="report" @select="SelectArea" :area="area" @highlight="HighlightArea" />
    <AreaPanelData @updated="Updated" :report="report" @select="SelectArea" :area="area" @highlight="HighlightArea" />

    <div class="area-panel-reports">
      <div class="parchment"></div>
      <div class="area-panel-reports-container">
        <div class="area-panel-report">test</div>
      </div>
    </div>
  </div>
</template>

<script>
import AreaPanelSummary from "./AreaPanelSummary.vue";
import AreaPanelData from "./AreaPanelData.vue";

export default {
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
  emits: ["select", "updated", "highlight"],
  components: {
    AreaPanelSummary,
    AreaPanelData,  
  },
  methods: {
    HighlightArea(area) {
      this.$emit("highlight", area);
    },
    UnhighlightArea(area) {
      this.$emit("highlight", null);
    },
    Updated(area) {
      this.$emit("updated", area);
    },  
    SelectArea(area) {
      this.SelectReport(null);
      this.$emit("select", area);
    }
  },
};
</script>

<style scoped></style>
