<template>
  <div class="report">
    <Map :map="map" />
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
  }
}
</script>

<style scoped>
  
  
</style>
