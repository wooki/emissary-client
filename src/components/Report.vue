<template>
  <div class="report">
    <div class="map-container">
      <Map :report="report" :area="selectedHex" @select="SelectHexagon" />
    </div>
    <div class="info">
      <AreaPanel
        :report="report"
        v-if="selectedHex"
        :area="selectedHex"
        @select="SelectArea"
        @updated="Updated"
      />
    </div>
  </div>
</template>

<script>
import Map from "./Map.vue";
import AreaPanel from "./AreaPanel.vue";

export default {
  props: {
    report: {
      type: Object,
      required: true,
    },
  },
  emits: ["updated"],
  components: {
    Map,
    AreaPanel,
  },
  data() {
    return {
      selectedHex: null,
    };
  },
  computed: {
    map() {
      return this.report.map;
    },
  },
  watch: {
    report(newReport, oldReport) {
      this.selectedHex = null;
    },
  },
  methods: {
    Updated(hex) {
      this.$emit("updated", this.report);
    },
    SelectHexagon(hex) {
      this.selectedHex = hex;
    },
    SelectArea(area) {
      const hex = this.map[`${area.x},${area.y}`];
      this.selectedHex = hex;
    },
  },
};
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
