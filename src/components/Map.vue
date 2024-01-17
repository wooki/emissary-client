<template>
  <div class="map" @mousemove="mousemove" @mousedown="mousedown" @mouseup="mouseup" @wheel="wheel">
    <div class="parchment"></div>
    <svg v-if="mounted" xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox">
      
      <defs>
        <!-- color 2 masks -->
        <mask id="banner_mask_base_0">
          <path
            fill="#ffffff"
            d="m 0,6 L 16,20 V 32 H 0 Z" />  
        </mask>
        <mask id="banner_mask_base_1">
          <rect
            fill="#ffffff"
            width="0"
            height="0"
            x="0"
            y="0" />           
        </mask>      
        <mask id="banner_mask_base_2">
          <rect
            fill="#ffffff"
            width="16"
            height="32"
            x="0"
            y="0" />           
        </mask>      
        <mask id="banner_mask_base_3">
          <path
            fill="#ffffff"
            d="M 0,2 V 32 H 5 V 2 Z m 11,0 v 30 h 5 V 2 Z" />
        </mask>
        <mask id="banner_mask_base_4">
          <rect
            fill="#ffffff"
            width="2"
            height="30"
            x="0"
            y="2" />
          <rect
            fill="#ffffff"
            width="4"
            height="30"
            x="6"
            y="2" />
          <rect
            fill="#ffffff"
            width="2"
            height="30"
            x="14"
            y="2" />        
        </mask>      
        <mask id="banner_mask_base_5">
          <rect
            fill="#ffffff"
            width="16"
            height="8"
            x="0"
            y="2" />
          <rect
            fill="#ffffff"
            width="16"
            height="14"
            x="0"
            y="18" />       
        </mask>          
        <mask id="banner_mask_base_5x">
          <rect
            fill="#ffffff"
            width="16"
            height="6"
            x="0"
            y="2" />
          <rect
            fill="#ffffff"
            width="16"
            height="16"
            x="0"
            y="16" />       
        </mask> 
        <mask id="banner_mask_base_5xx">
          <rect
            fill="#ffffff"
            width="16"
            height="8"
            x="0"
            y="2" />
          <rect
            fill="#ffffff"
            width="16"
            height="13"
            x="0"
            y="19" />         
        </mask>          
        <mask id="banner_mask_base_6">
          <path
            fill="#ffffff"
            d="M 8,9 0,15 v 4 l 8,-6 8,6 V 15 L 8,9" />  
        </mask>
        <mask id="banner_mask_base_7">
          <path
            fill="#ffffff"
            d="m 6,2 v 8 H 0 v 4 h 6 v 18 h 4 V 14 h 6 V 10 H 10 V 2 Z" />  
        </mask>
        <mask id="banner_mask_base_8_a">
          <rect
            fill="#ffffff"
            width="5"
            height="30"
            x="0"
            y="2" />
        </mask>     
        <mask id="banner_mask_base_8_b">
          <rect
            fill="#ffffff"
            width="5"
            height="30"
            x="11"
            y="2" />
        </mask>
        <mask id="banner_mask_base_9_a">
          <rect
            fill="#ffffff"
            width="16"
            height="8"
            x="0"
            y="2" />
        </mask>     
        <mask id="banner_mask_base_9_b">
          <rect
            fill="#ffffff"
            width="16"
            height="12"
            x="0"
            y="20" />
        </mask>
        <!-- color 3 masks -->
        <mask id="banner_mask_shape_0">
          <circle
            fill="#ffffff"
            r="6"
            cx="8"
            cy="12" />
        </mask>   
        <mask id="banner_mask_shape_1">
          <rect
            fill="#ffffff"
            width="12"
            height="4"
            x="2"
            y="10" /> 
          <rect
            fill="#ffffff"
            width="4"
            height="12"
            x="6"
            y="6" /> 
        </mask>     
        <mask id="banner_mask_shape_2">
          <path
            fill="#ffffff"
            d="M 8 16 L 11.471 19.208 L 11.127 14.494 L 15.799 13.78 L 11.9 11.11 L 14.255 7.012 L 9.736 8.396 L 8 4 L 6.264 8.396 L 1.745 7.012 L 4.1 11.11 L 0.201 13.78 L 4.873 14.494 L 4.529 19.208 L 8 16" />  
        </mask>     
        <mask id="banner_mask_shape_3">
          <path
            fill="#ffffff"
            d="m 7,2 V 11 H 0 v 2 h 7 V 32 h 2 V 13 h 8 V 11 H 9 V 2 Z" />  
        </mask>
        <mask id="banner_mask_shape_4">
          <path
            fill="#ffffff"
            d="m 0,6 v 4 l 16,13 v -4" />  
        </mask>
        
        
      </defs>
      
      <Hexagon @mouseenter="hexHighlight" @mouseleave="hexUnhighlight" :data="hex" :terrain="hex.terrain" :coord="`${hex.x},${hex.y}`" @click="SelectHexagon(hex)" v-for="hex in mapHexagons" :key="hex.key" :points="hex.points" :fill="hex.fill" strokeWidth="1" :stroke="hex.stroke" />
      <path v-for="border in mapBorders" :key="border.key" :d="border.path" :stroke-width="6" :stroke="border.stroke" fill="none" stroke-dasharray="10,15" stroke-linecap="round" />
      <text v-for="label in mapLabels" :key="label.key" :x="label.x" :y="label.y" :class="label.class">{{ label.text }}</text>      

      <Hexagon v-if="hoveredHex" terrain="hovered" :coord="`${hoveredHex.x},${hoveredHex.y}`" :points="hoveredHex.points" fill="none" strokeWidth="4" stroke="white" />
      <Hexagon v-if="selectedHex" terrain="selected" :coord="`${selectedHex.x},${selectedHex.y}`" :center="selectedHex.center" :points="selectedHex.points" fill="none" strokeWidth="6" stroke="white" strokeDashArray="12,4" />

      <Banner :x="1050" :y="1000" flag="03876" />     
      <Banner :x="1100" :y="1000" :flag="RandomFlag()" />
      <Banner :x="1150" :y="1000" :flag="RandomFlag()" />  
      <Banner :x="1200" :y="1000" :flag="RandomFlag()" />
      <Banner :x="1250" :y="1000" :flag="RandomFlag()" />
      <Banner :x="1300" :y="1000" :flag="RandomFlag()" />      
      <Banner :x="1350" :y="1000" :flag="RandomFlag()" />
      <Banner :x="1400" :y="1000" :flag="RandomFlag()" />
      <Banner :x="1450" :y="1000" :flag="RandomFlag()" />

      <Banner :x="1050" :y="1100" :flag="RandomFlag()" />
      <Banner :x="1100" :y="1100" :flag="RandomFlag()" />
      <Banner :x="1150" :y="1100" :flag="RandomFlag()" />      
      <Banner :x="1200" :y="1100" :flag="RandomFlag()" />
      <Banner :x="1250" :y="1100" :flag="RandomFlag()" />
      <Banner :x="1300" :y="1100" :flag="RandomFlag()" />      
      <Banner :x="1350" :y="1100" :flag="RandomFlag()" />
      <Banner :x="1400" :y="1100" :flag="RandomFlag()" />
      <Banner :x="1450" :y="1100" :flag="RandomFlag()" />

      <Banner :x="1050" :y="1200" :flag="RandomFlag()" />
      <Banner :x="1100" :y="1200" :flag="RandomFlag()" />
      <Banner :x="1150" :y="1200" :flag="RandomFlag()" />      
      <Banner :x="1200" :y="1200" :flag="RandomFlag()" />
      <Banner :x="1250" :y="1200" :flag="RandomFlag()" />
      <Banner :x="1300" :y="1200" :flag="RandomFlag()" />      
      <Banner :x="1350" :y="1200" :flag="RandomFlag()" />
      <Banner :x="1400" :y="1200" :flag="RandomFlag()" />
      <Banner :x="1450" :y="1200" :flag="RandomFlag()" />
      
    </svg>
    <!-- {{ JSON.stringify(map) }} -->
  </div>
</template>

<script>
import Hexagon from './Hexagon.vue'
import Banner from './Banner.vue'
import {Corners, Center, AdjacentCoords, SameCoord, ExtractPaths} from '../libs/HexUtils'

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
        lowland: "#65b240",
        forest: "#316e44",
        desert: "goldenrod",
        town: "Sienna",
        city: "Sienna",
        unknown: "#4c84d7",        
      }
    },
    ownedColor: {
      type: String,
      default: "#ee3a5f"
    }
  },
  emits: ["selected"],
  components: {
    Hexagon,
    Banner
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
    RandomFlag() {
      let shuffle = function(array) {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {

          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
      }

      let getRandomInt = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

      let x = shuffle([0,1,2,3,4,5,6,7,8,9]);
      
      let flag = [getRandomInt(0, 9),getRandomInt(0, 9),x.pop(),x.pop(),x.pop()].join('');
      return flag;
    },
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
        center: center,
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
    fill: #ee3a5f;
  }

  .parchment {
    z-index: unset;
  }

</style>
