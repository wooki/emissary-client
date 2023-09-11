<template>
  <div class="report">
    <Map :map="map" @select="SelectHexagon" />
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
  
  
</style>
