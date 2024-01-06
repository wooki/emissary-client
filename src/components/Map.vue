<template>
  <div class="map" @mousemove="mousemove" @mousedown="mousedown" @mouseup="mouseup" @wheel="wheel">
    <div class="parchment"></div>
    <svg v-if="mounted" xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox">
      
      <Hexagon @mouseenter="hexHighlight" @mouseleave="hexUnhighlight" :data="hex" :terrain="hex.terrain" :coord="`${hex.x},${hex.y}`" @click="SelectHexagon(hex)" v-for="hex in mapHexagons" :key="hex.key" :points="hex.points" :fill="hex.fill" strokeWidth="1" :stroke="hex.stroke" />
      <path v-for="border in mapBorders" :key="border.key" :d="border.path" :stroke-width="6" :stroke="border.stroke" fill="none" stroke-dasharray="10,15" stroke-linecap="round" />
      <text v-for="label in mapLabels" :key="label.key" :x="label.x" :y="label.y" :class="label.class">{{ label.text }}</text>      

      <Hexagon v-if="hoveredHex" terrain="hovered" :coord="`${hoveredHex.x},${hoveredHex.y}`" :points="hoveredHex.points" fill="none" strokeWidth="2" stroke="red" />
      <Hexagon v-if="selectedHex" terrain="selected" :coord="`${selectedHex.x},${selectedHex.y}`" :points="selectedHex.points" fill="none" strokeWidth="6" stroke="red" />

    </svg>
    <!-- {{ JSON.stringify(map) }} -->
  </div>
</template>

<script>
import Hexagon from './Hexagon.vue'
import {Corners, Center, AdjacentCoords, SameCoord, ExtractPaths} from '../libs/HexUtils'
import concaveman from 'concaveman';

export default {
  props: {
    report: {
      type: Object,
      required: true
    },
    area: {
      type: Object,
      default: null
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
        town: "Sienna",
        city: "Sienna",
        unknown: "#f0eae8",
      }
    },
    ownedColor: {
      type: String,
      default: "#a865c9"
    }
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
      scales: [0.3, 0.4, 0.5, 0.63, 0.75, 0.85, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.4, 2.8, 3.2, 3.8, 4.4, 5, 5.8, 6.6, 7.4, 8.4, 9.4, 10.4, 13],
      scaleIndex: 10,
      mouseDown: false,
      scrollSpeed: 5,
      hoveredHex: null,
      clientHeight: 0,
      clientWidth: 0
    };
  },
  computed: {
    map() {
      return this.report.map;
    },
    selectedHex() {
      if (this.area) {
        return this.GetMapHexFromArea(this.area);
      }
      return null;
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
      let ratio = this.clientWidth / this.clientHeight      

      let centerX = this.mapBounds.min.x + Math.round((this.mapBounds.max.x - this.mapBounds.min.x) / 2);
      let centerY = this.mapBounds.min.y + Math.round((this.mapBounds.max.y - this.mapBounds.min.y) / 2);
      let displayWidth = Math.round((this.mapBounds.max.x - this.mapBounds.min.x) / scale * ratio);
      let displayHeight = Math.round((this.mapBounds.max.y - this.mapBounds.min.y) / scale);
      let displayX = centerX - Math.round(displayWidth / 2);
      let displayY = centerY - Math.round(displayHeight / 2);
      displayX = displayX + this.focusX;
      displayY = displayY + this.focusY;

      // set height and width to be whichever is larger
      if (displayWidth > displayHeight) displayHeight = displayWidth;
      if (displayHeight > displayWidth) displayWidth = displayHeight;

      let DisplayBox = `${displayX} ${displayY} ${displayWidth * ratio} ${displayHeight}`;
      return DisplayBox;
    },
    mapHexagons() {
      return Object.values(this.map).map((hex) => {
          return this.GetMapHexFromArea(hex);
      });
    },
    mapLabels() {
      return this.mapSettlements.map((hex) => {
        const center = Center(hex.x, hex.y, this.hexagonSize, 0, 0);
        const points = Corners(center.x, center.y, this.hexagonSize)

        const labelData = {
          x: points[0].x,
          y: points[0].y,
          key: `${hex.x},${hex.y}`,
          text: hex.name,
          class: `label label-${hex.terrain}`
        }        
      
        if (hex.owner == this.report.Me()) {
          labelData.class = `label label-${hex.terrain} label-me`;
        }
        
        return labelData;
      });
    },
    mapSettlements() {
      return Object.values(this.map).
        filter(hex => ["city", "town"].includes(hex.terrain))
    },
    mapBorders() {
      return this.mapSettlements.map((settlement) => {

        let stroke = '#000';

        // find all edges of this province
        let edgePointPairs = [];
        settlement.borders.forEach(border => {
        
            stroke = '#000';

            // check adjacent in each direction and add points for that
            // edge of it is not
            let adjacent = AdjacentCoords(border);

            adjacent.forEach((neighbour, index) => {
              let neighbourHex = this.GetMapHexFromCoord(neighbour);

              if (neighbourHex &&
                  !SameCoord(neighbourHex, settlement) &&
                  !SameCoord(neighbourHex.area.province, settlement)) {

                    // console.log("neighbourHex", neighbourHex.points);
                    let p1 = neighbourHex.points[(index + 3) % 6];
                    let p2 = neighbourHex.points[((index) + 4) % 6];
                    edgePointPairs.push([p1, p2])
              }
            });
        });
        let path = "";
        edgePointPairs.forEach((edgePointPair) => {
          path += ` M ${edgePointPair[0].x},${edgePointPair[0].y} L ${edgePointPair[1].x},${edgePointPair[1].y}`
        });          

        // this sorts out the borders into longer lines but due to way
        // we add a dashed line this actually doesn't look as good on 
        // the screen - so remain with old solution for now
        // let borderPaths = ExtractPaths(edgePointPairs);
        // borderPaths.forEach((borderPath) => {
        //   if (borderPath.length > 0) {
        //     let operator = "M";
        //     borderPath.forEach((point) => {
        //       path += ` ${operator} ${point[0].x},${point[0].y}`
        //       operator = "L";
        //     });          
        //     let point = borderPath.toReversed()[0];
        //     path += ` ${operator} ${point[1].x},${point[1].y}`            
        //   }
        // });        
        
        return {
          key: `border-${settlement.name}`,
          path: path,
          stroke: stroke
        }

      });
    }
  },
  methods: {
    hexHighlight(hex) {
      this.hoveredHex = hex;
    },
    hexUnhighlight(hex) {
      this.hoveredHex = null;
    },
    GetMapHexFromArea(hex) {
      const center = Center(hex.x, hex.y, this.hexagonSize, 0, 0);
      const points = Corners(center.x, center.y, this.hexagonSize)

      const hexData = {
        x: hex.x,
        y: hex.y,
        key: `${hex.x},${hex.y}`,
        terrain: hex.terrain,
        points: points,
        min: {x: points[5].x, y: points[0].y},
        max: {x: points[1].x, y: points[3].y},
        fill: this.terrainColours[hex.terrain],
        stroke: '#00000099',
        area: hex
      }
      
      if (hex.owner == this.report.Me()) {
        hexData.fill = this.ownedColor;
      }
      
      return hexData;
    },
    GetMapHexFromCoord(coord) {
      if (this.map[`${coord.x},${coord.y}`]) {
        return this.GetMapHexFromArea(this.map[`${coord.x},${coord.y}`]);
      }
      return null;
    },
    SelectHexagon(hex) {
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
    this.clientWidth = this.$el.clientWidth;
    this.clientHeight = this.$el.clientHeight;
    this.resizeObserver = new ResizeObserver((entries) => {
      this.clientWidth = this.$el.clientWidth;
      this.clientHeight = this.$el.clientHeight;
      this.$forceUpdate();
    });
    this.resizeObserver.observe(this.$el);
  },
  beforeUnmount() {
    this.mounted = false;
    this.resizeObserver.unobserve(this.$el);
  }
}
</script>

<style scoped>
  .map {
    /* width: calc(100vh - 60px);
    height: calc(100vh - 60px); */
    position: relative;
    overflow: hidden;
    max-width: 100%;
    max-height: 100%;       
  }
  svg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: inherit;
    width: inherit;
    max-width: 100%;
    max-height: 100%;
    /* border: 4px solid black; */
    /* background-color: var(--color-background);         */
  }
  text.label {
    font-size: 38px;
    font-weight: bold;
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
    user-select: none;
    pointer-events: none;    
  }

  text.label-me {
    fill: #a865c9;
  }

  .parchment {
    z-index: unset;
  }

</style>
