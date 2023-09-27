<template>
  <div class="report">
    <Map :map="map" @select="SelectHexagon" />
    <div class="info">Info panel</div>
  </div>
</template>

<script>
import Map from './Map.vue'

export default {
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  components: {
    Map
  },
  computed: {
    map() {
      return this.report.map;
    }
  },
  methods: {
    SelectHexagon(hex) {
      console.log("SelectHexagon", hex);
    }
  }
}
</script>

<style scoped>
  .report {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;    
  }

  .map {
    flex: 0 0 100vw;
    width: 100vw;
    height: 100vw;
  }

  .info {
    display: block;
    background: green;
    flex: 1 0 auto;
    width: 100%;
    height: calc(100vh - calc(100vw + var(--header-height)));
  }

  @media (min-aspect-ratio: 1/1) {
    .report {
      flex-direction: row;    
    }
    .info {
      background: red;
    }
  }
  
</style>
