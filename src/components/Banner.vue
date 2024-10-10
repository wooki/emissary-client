<template>
  <g
    :mask="maskUrl"
    :transform="transform"
    :transform-origin="transformOrigin"
    class="banner"
    @click="click"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave">
    
    <rect x="0" y="0" width="32" height="32" :fill="color1" />
    <rect :mask="`url(#${mask1})`" x="0" y="0" width="32" height="32" :fill="color2" />
    <rect v-if="mask2" :mask="`url(#${mask2})`" x="0" y="0" width="32" height="32" :fill="color3" />
        
  </g>
</template>

<script>
import { Colors1, Colors2, Colors3 } from '@/libs/BannerColors.js';

export default {
  props: {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    flag: {
      type: String,
      default: '01234',
      required: true,
    },
    scale: {
      type: Number,
      default: 1,
    },
    mask: {
      type: String,
      default: ""
    }
  },
  emits: ['click', 'mouseenter', 'mouseleave'],
  data() {
    return {
      Colors1: Colors1,
      Colors2: Colors2,
      Colors3: Colors3,
      SymbolCount: 9,
    };
  },
  computed: {
    maskUrl() {
      if (this.mask != '') {
        return `url(#${this.mask}_mask)`;
      }
      return null;
    },  
    transform() {
      return `scale(${this.scale}) translate(${this.x},${this.y})`;
    },
    transformOrigin() {
      return `${Math.round(this.x)}px ${Math.round(this.y)}px`;
    },
    flagfields() {
      return this.flag.split('');
    },
    color1() {
      return this.Colors1[this.flagfields[2]];
    },
    color2() {
      // if (this.flagfields[1]+1 > this.SymbolCount) {  
      //   return this.Colors2[this.flagfields[3]];        
      // }
      return this.Colors2[this.flagfields[3]];        
    },
    color3() {
      return this.Colors3[this.flagfields[4] % 3];                      
    },
    mask1() {
      if (this.flagfields[0] == 0 && this.flagfields[1] != 3) {
        return `banner_mask_base_${this.flagfields[0]}x`; 
      }
      return `banner_mask_base_${this.flagfields[0]}`;                  
    },
    mask2() {
      if (this.flagfields[0] == 0 && this.flagfields[1] == 3) {
          return `banner_mask_shape_${this.flagfields[1]}x`;
        } else if (this.flagfields[0] == 4 && this.flagfields[1] == 3) {
          return `banner_mask_shape_${this.flagfields[1]}v`;
        } else if (this.flagfields[0] == 5 && this.flagfields[1] == 3) {
          return `banner_mask_shape_${this.flagfields[1]}h`;
        } else if (this.flagfields[0] == 6 && this.flagfields[1] == 3) {
          return `banner_mask_shape_${this.flagfields[1]}v`;
        } else if (this.flagfields[0] == 8 && this.flagfields[1] == 3) {
          return `banner_mask_shape_${this.flagfields[1]}h`;
        } else if (this.flagfields[0] == 9 && this.flagfields[1] == 3) {
          return `banner_mask_shape_${this.flagfields[1]}x`;
        } else if (this.flagfields[0] == 8 && this.flagfields[1] == 4) {
          return `banner_mask_shape_${this.flagfields[1]}x1`;
        } else if (this.flagfields[0] == 9 && this.flagfields[1] == 4) {
          return `banner_mask_shape_${this.flagfields[1]}x2`;
        } else if (this.flagfields[0] == 5 && this.flagfields[1] == 6) {
          return `banner_mask_shape_${this.flagfields[1]}x`;
        } else if (this.flagfields[1] < this.SymbolCount) {
          return `banner_mask_shape_${this.flagfields[1]}`;
        } else {
          return null;
        }
    },
  },
  methods: {
    click() {
      this.$emit('click', this.data);
    },
    mouseenter() {
      this.$emit('mouseenter', this.data);
    },
    mouseleave() {
      this.$emit('mouseleave', this.data);
    },
  },
};
</script>

<style scoped>
.banner {
  cursor: pointer;
}
.hexagon.area.selected {
  animation: 800ms ease-in-out 0ms infinite running pulse;
}

image {
  pointer-events: none;
}
</style>
