<template>
  <div class="report">
    <div class="map-container">
      <Map :map="map" @select="SelectHexagon" />
    </div>
    <div class="info">
      <AreaPanel v-if="selectedHex" :area="selectedHex" />
    </div>    
  </div>
</template>

<script>
import Map from './Map.vue'
import AreaPanel from './AreaPanel.vue'

export default {
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  components: {
    Map,
    AreaPanel
  },
  data() {
    return {
      selectedHex: null,
    }
  },
  computed: {
    map() {
      return this.report.map;
    }
  },
  methods: {
    SelectHexagon(hex) {
      console.log("SelectHexagon", hex);
      this.selectedHex = hex;
    }
  }
}
</script>

<style scoped>
  .report {
    display: grid;
    grid-template-columns: 1fr;    
    grid-template-rows: 2fr minmax(300px, 1fr);
    height: calc(100vh - var(--header-height));
    max-height: calc(100vh - var(--header-height));
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
    background: green;
    grid-row: 2;
    grid-column: 1;
    overflow: auto;
  }

  @media (min-aspect-ratio: 1.2/1) {
    .report {
      grid-template-columns: 2fr minmax(300px, 1fr);    
      grid-template-rows: 1fr;
    }

    .map-container {      
    }

    .info {
      background: gold;
      grid-row: 1;
      grid-column: 2;
    }
  }
  
</style>
