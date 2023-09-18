<template>
  <div class="map" @mousemove="mousemove" @mousedown="mousedown" @mouseup="mouseup" @wheel="wheel" style="background-color: #f0eae8;">
    <svg v-if="mounted" xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox">    
      <Hexagon :terrain="hex.terrain" :coord="`${hex.x},${hex.y}`" @click="SelectHexagon(hex)" v-for="hex in mapHexagons" :key="hex.key" :points="hex.points" :fill="hex.fill" strokeWidth="1" :stroke="hex.stroke" />
      <text v-for="label in mapLabels" :key="label.key" :x="label.x" :y="label.y" :class="label.class">{{ label.text }}</text>
      <path v-for="border in mapBorders" :key="border.key" :d="border.path" :stroke-width="6" :stroke="border.stroke" fill="none" stroke-dasharray="10,15" stroke-linecap="round" />
    </svg>
    <!-- {{ JSON.stringify(map) }} -->    
  </div>
</template>

<script>
import Hexagon from './Hexagon.vue'
import {Corners, Center, AdjacentCoords} from '../libs/HexUtils'
import concaveman from 'concaveman';

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
        town: "Sienna",
        city: "Sienna",
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
      return Object.values(this.map).map((hex) => {        
          return this.GetMapHexFromArea(hex);
      });
    },
    mapLabels() {
      return this.mapSettlements.map((hex) => {
        const center = Center(hex.x, hex.y, this.hexagonSize, 0, 0);
        const points = Corners(center.x, center.y, this.hexagonSize)
      
        return {
          x: points[0].x,
          y: points[0].y,
          key: `${hex.x},${hex.y}`,
          text: hex.name,
          class: "label label-" + hex.terrain
        }
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
        Object.values(this.mapHexagons).forEach(hex => {

          // process only if this hex belongs to this settlement
          if (this.IsSameCoord(hex.area.closest_settlement, settlement)) {

            stroke = '#000';

            // check adjacent in each direction and add points for that
            // edge of it is not                     
            let adjacent = AdjacentCoords(hex.area);

            adjacent.forEach((neighbour, index) => {
              let neighbourHex = this.GetMapHexFromCoord(neighbour);
              
              console.log("points", index);    

              if (neighbourHex &&
                  !this.IsSameCoord(neighbourHex, settlement) &&
                  !this.IsSameCoord(neighbourHex.area.closest_settlement, settlement)) {
                    
                    console.log("neighbourHex", neighbourHex.points);                    
                    let p1 = neighbourHex.points[(index + 3) % 6];
                    let p2 = neighbourHex.points[((index) + 4) % 6];
                    edgePointPairs.push([p1, p2])
              }
            });            
          }
        });
        let path = "";
        edgePointPairs.forEach((edgePointPair) => {
          // console.log("edgePointPair", edgePointPair);
          path += ` M ${edgePointPair[0].x},${edgePointPair[0].y} L ${edgePointPair[1].x},${edgePointPair[1].y}`
        }); 
        console.log("path", path);       
        return {
          key: `border-${settlement.name}`,
          // points: concaveman(edgePoints).map(p => `${p[0]} ${p[1]}`).join(" "),
          // points: this.SortByClockwiseOrder(edgePoints).map(p => `${p.x} ${p.y}`).join(" ")
          path: path,
          stroke: stroke
        }

      });
    }
  },
  methods: {
    // SortByClockwiseOrder(points) {
    //   // Calculate the centroid of all points
    //   const centroid = points.reduce(
    //     (acc, point) => {
    //       acc.x += point.x;
    //       acc.y += point.y;
    //       return acc;
    //     },
    //     { x: 0, y: 0 }
    //   );
    //   centroid.x /= points.length;
    //   centroid.y /= points.length;

    //   // Calculate the angle between each point and the centroid
    //   points.forEach(point => {
    //     point.angle = Math.atan2(point.y - centroid.y, point.x - centroid.x);
    //   });

    //   // Sort the points by angle in ascending order
    //   points.sort((a, b) => a.angle - b.angle);

    //   // Remove the temporary angle property
    //   points.forEach(point => {
    //     delete point.angle;
    //   });

    //   return points;
    // },
    GetMapHexFromArea(hex) {
      const center = Center(hex.x, hex.y, this.hexagonSize, 0, 0);
      const points = Corners(center.x, center.y, this.hexagonSize)
      
      return {
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
    },
    IsSameCoord(c1, c2) {
      return (c1 && c2 && c1.x == c2.x && c1.y == c2.y);
    },
    GetMapHexFromCoord(coord) {
      if (this.map[`${coord.x},${coord.y}`]) {
        return this.GetMapHexFromArea(this.map[`${coord.x},${coord.y}`]);
      }
      return null;
    },
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
  text.label {
    font-size: 38px;
    font-weight: bold;
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.6);
    user-select: none;    
  }
  
</style>
