<template>
  <div class="area-panel">
    <AreaPanelSummary @updated="Updated" :report="report" @select="SelectArea" :area="area" @highlight="HighlightArea" />
    <AreaPanelData @updated="Updated" :report="report" @select="SelectArea" :area="area" @highlight="HighlightArea" />
    <AreaPanelItems @updated="Updated" :report="report" @select="SelectArea" :area="area" @highlight="HighlightArea" />    
  </div>
</template>

<script>
import AreaPanelSummary from "./AreaPanelSummary.vue";
import AreaPanelData from "./AreaPanelData.vue";
import AreaPanelItems from "./AreaPanelItems.vue";

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
    AreaPanelItems
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
      this.$emit("select", area);
    }
  },
};
</script>

<style scoped></style>
