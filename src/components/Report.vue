<template>
  <div class="report">
    <div class="map-container">
      <Map
        :report="report"
        :area="selectedHex"
        :hovered-area="hoveredHex"
        @select="SelectHexagon"
        @hover="HoverHexagon" />
    </div>
    <div class="info">
      <AreaPanel
        v-if="selectedHex"
        :report="report"
        :area="selectedHex"
        @select="SelectArea"
        @updated="Updated"
        @highlight="HighlightHexagon" />
    </div>
  </div>
</template>

<script>
import Map from './Map.vue';
import AreaPanel from './AreaPanel.vue';

export default {
  components: {
    Map,
    AreaPanel,
  },
  props: {
    report: {
      type: Object,
      required: true,
    },
  },
  emits: ['updated'],
  data() {
    return {
      selectedHex: null,
      hoveredHex: null,
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
      this.$emit('updated', this.report);
    },
    SelectHexagon(hex) {
      this.selectedHex = hex;
    },
    HoverHexagon(hex) {
      this.hoveredHex = hex;
    },
    HighlightHexagon(coord) {
      if (coord) {
        const hex = this.map[`${coord.x},${coord.y}`];
        this.hoveredHex = hex;
      } else {
        this.hoveredHex = null;
      }
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
