<template>
  <div class="map">
    <svg xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox">
      <path stroke="#000" strokeWidth="1" d="M0 0L1000 1000Z"/>
      <path stroke="#000" strokeWidth="1" d="M0 500L1000 500Z"/>
      <Hexagon />
    </svg>
    <!-- {{ JSON.stringify(map) }} -->    
  </div>
</template>

<script>
import Hexagon from './Hexagon.vue'

export default {
  props: {
    map: {
      type: Object,
      required: true
    }
  },
  components: {
    Hexagon
  },
  computed: {
    viewBox() {
      return "0 0 1000 1000";
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  svg {
    width: 100vw;
    height: calc(100vh - 50px);
  }
  
</style>
