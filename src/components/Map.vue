<template>
  <div class="map" @mousemove="mousemove" @mousedown="mousedown" @mouseup="mouseup" @wheel="wheel" style="background-color: #f0eae8;">
    <svg v-if="mounted" xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox">    
      <Hexagon @click="SelectHexagon(hex)" v-for="hex in mapHexagons" :key="hex.key" :points="hex.points" :fill="hex.fill" strokeWidth="1" :stroke="hex.stroke" />      
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
        city: "red",
        unknown: "#f0eae8",      
      }
    },    
  },
  emits: ["selected"],  
  components: {
    Hexagon
  },
  data() {
    return {
      mounted: false,
      focusX: 0,
      focusY: 0,
      clientX: null,
      clientY: null,
      scales: [0.3, 0.5, 0.75, 1, 1.2, 1.4, 1.8, 2, 3, 4, 6, 10],
      scaleIndex: 2,
      mouseDown: false,
      scrollSpeed: 5
    };
  },  
  computed: {
    clientWidth() {
      if (this.mounted) return this.$el.clientWidth;
      return 0;
    },
    clientHeight() {
      if (this.mounted) return this.$el.clientHeight;
      return 0;
    },
    mapBoundsPoints() {
      if (!this.mounted) return "0 0 0 0";

      return `${this.mapBounds.min.x} ${this.mapBounds.min.y} ${this.mapBounds.max.x} ${this.mapBounds.min.y} ${this.mapBounds.max.x} ${this.mapBounds.max.y} ${this.mapBounds.min.x} ${this.mapBounds.max.y}`
    },
    mapBounds() {
      return this.getMapBounds();
    },
    mapCenter() {
      return {x: this.mapBounds.max.x - this.mapBounds.min.x, y: this.mapBounds.max.y - this.mapBounds.min.y};
    },
    viewBox() {
      if (!this.mounted) return "0 0 0 0";

      let bounds = this.mapBounds;      
      
      let scale = this.scales[this.scaleIndex];

      let centerX = this.mapBounds.min.x + Math.round((this.mapBounds.max.x - this.mapBounds.min.x) / 2);
      let centerY = this.mapBounds.min.y + Math.round((this.mapBounds.max.y - this.mapBounds.min.y) / 2);
      let displayWidth = Math.round((this.mapBounds.max.x - this.mapBounds.min.x) / scale);
      let displayHeight = Math.round((this.mapBounds.max.y - this.mapBounds.min.y) / scale);
      let displayX = centerX - Math.round(displayWidth / 2);
      let displayY = centerY - Math.round(displayHeight / 2);
      displayX = displayX + this.focusX;
      displayY = displayY + this.focusY;

      let DisplayBox = `${displayX} ${displayY} ${displayWidth} ${displayHeight}`;
      return DisplayBox;      
    },
    mapHexagons() {
      var test = {
        "0,0": {
          "x": 0,
          "y": 0,
          "terrain": "city"
        },
      };
      // return Object.values(test).map((hex) => {
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
          fill: this.terrainColours[hex.terrain],
          stroke: '#00000099'
        }
      });
    }
  },
  methods: {
    SelectHexagon(hex) {
      console.log("SelectHexagon", hex);
      this.$emit("select", this.map[`${hex.x},${hex.y}`]);
    },
    wheel(e) {
      if (e.deltaY > 0 && this.scaleIndex > 0) {
        this.scaleIndex = this.scaleIndex - 1;
      } else if (e.deltaY < 0 && this.scaleIndex < (this.scales.length - 1)) {
        this.scaleIndex = this.scaleIndex + 1;
      }      
    },
    mousedown(e) {
      this.mouseDown = true; 
      this.clientX = e.clientX;
      this.clientY = e.clientY;
    },  
    mouseup() {
      this.mouseDown = false; 
      this.clientX = null;
      this.clientY = null;
    },  
    mousemove(e) {
      if (this.mouseDown && this.clientX && this.clientY) {

        let scale = this.scales[this.scaleIndex];

        this.focusX = this.focusX + Math.round((this.clientX - e.clientX) * this.scrollSpeed / scale); 
        this.focusY = this.focusY + Math.round((this.clientY - e.clientY) * this.scrollSpeed / scale); 

        this.clientX = e.clientX;
        this.clientY = e.clientY;
      }
    },  
    getMapBounds() {
      let min = {x: Infinity, y: Infinity};
      let max = {x: 0, y: 0};
      this.mapHexagons.forEach((hex) => {
        if (hex.min.x < min.x) min.x = Math.floor(hex.min.x);
        if (hex.min.y < min.y) min.y = Math.floor(hex.min.y);
        if (hex.max.x > max.x) max.x = Math.ceil(hex.max.x);
        if (hex.max.y > max.y) max.y = Math.ceil(hex.max.y);        
      });
      
      return {
        min,
        max
      };
    }
  },
  mounted() {
    this.mounted = true;
  },
  beforeUnmount() {
    this.mounted = false;
  }
}
</script>

<style scoped>
  .map {
    width: calc(100vh - 60px);
    height: calc(100vh - 60px);
    position: relative;
    overflow: hidden;
    border: 4px solid black;
  }
  svg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
</style>
