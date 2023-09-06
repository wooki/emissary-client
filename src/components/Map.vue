<template>
  <div class="map">
    <svg xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox">
      <path stroke="#000" strokeWidth="1" d="M0 0L1000 1000Z"/>
      <path stroke="#000" strokeWidth="1" d="M0 500L1000 500Z"/>
      <Hexagon v-for="hex in mapHexagons" :key="hex.key" :points="hex.points" :fill="hex.fill" />
    </svg>
    <!-- {{ JSON.stringify(map) }} -->    
  </div>
</template>

<script>
import Hexagon from './Hexagon.vue'
import {Corners, Center} from '../libs/HexUtils'

export default {
  props: {
    map: {
      type: Object,
      required: true
    },
    hexagonSize: {
      type: Number,
      default: 32
    },
    terrainColours: {
      type: Object,
      default: {
        peak: 'dimgray',
        ocean: "#3D59AB",
        mountain: "slategray",
        lowland: "limegreen",
        forest: "forestgreen",
        desert: "goldenrod",
        town: "black",
        city: "red"        
      }
    },    
  },
  components: {
    Hexagon
  },
  computed: {
    viewBox() {
      let min = {x: Infinity, y: Infinity};
      let max = {x: 0, y: 0};
      this.mapHexagons.forEach((hex) => {
        if (hex.min.x < min.x) min.x = hex.min.x;
        if (hex.min.y < min.y) min.y = hex.min.y;
        if (hex.max.x > max.x) max.x = hex.max.x;
        if (hex.max.y > max.y) max.y = hex.max.y;        
      });
      return `${min.x - this.hexagonSize} ${min.y - this.hexagonSize} ${max.x + this.hexagonSize} ${max.y + this.hexagonSize}`;
    },
    mapHexagons() {
      return Object.values(this.map).map((hex) => {
        const center = Center(hex.x, hex.y, this.hexagonSize, 0, 0);
        const points = Corners(center.x, center.y, this.hexagonSize)
        
        return {
          x: hex.y,
          y: hex.y,
          key: `${hex.x},${hex.y}`,
          terrain: hex.terrain,
          points: points,
          min: {x: points[5].x, y: points[0].y},
          max: {x: points[1].x, y: points[3].y},
          fill: this.terrainColours[hex.terrain]
        }
      });
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
