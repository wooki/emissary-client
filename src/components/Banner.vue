<template>
  <g :transform="transform" viewBox="0 0 16 32" :transform-origin="transformOrigin" class="banner" @click="click" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <path
    fill="#000000"
     d="M 0,0 H 16 V 2 H 0 Z" />
     <path
    stroke="#000000"
    stroke-width="2"
    fill="none"
     d="M 8,-1 V 34" />
     <path
    :fill="color1"
     d="M 0,2 H 16 V 32 L 8,25 0,32 Z" />
     <path
      :fill="color2"
      d="M 0,2 H 16 V 32 L 8,25 0,32 Z"
      :mask="`url(#${mask1})`" />
      <path v-if="mask2"
      :transform="iconTransform"
      :fill="color3"
      d="M 0,2 H 16 V 32 L 8,25 0,32 Z"
      :mask="`url(#${mask2})`" />
  </g>  
</template>

<script>
export default {
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    flag: {
      type: String,
      default: '01234' 
    }
  },
  data() {
    return {
      Colors1: ["#090909","#6f0015","#004200","#000066","#4d123f","#75003f","#00a3dd","#ffffff","#f8d80e","#b82300"],
      Colors2: ["#a7a7dd","#AA0013","#006627","#00247d","#b036b0","#db61a2","#064860","#ffffff","#FABD16","#cf2300"],
      Colors3: ["#090909","#AA0013","#10B110","#2b2be9","#FABD16","#75003f","#00a3dd","#ffffff","#f8d80e","#ed4107"]      
    }
  },
  emits: ["click", "mouseenter", "mouseleave"],
  computed: {
    transform() {
      return `scale(2) translate(${this.x},${this.y})`;    },
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
      return this.Colors2[this.flagfields[3]];
    },
    color3() {
      return this.Colors3[this.flagfields[4]];
    },
    mask1() {
      if (this.flagfields[0] >= 8) {
        return `banner_mask_base_${this.flagfields[0]}_a`;
      } else if (this.flagfields[0] >= 5 && this.flagfields[1] == 4) {
        return `banner_mask_base_${this.flagfields[0]}xx`;
      } else if (this.flagfields[0] >= 5 && this.flagfields[1] < 4) {
        return `banner_mask_base_${this.flagfields[0]}x`;
      } else {
        return `banner_mask_base_${this.flagfields[0]}`;
      }
    },
    mask2() {
      if (this.flagfields[0] == 6) {
        return null;
      } else if (this.flagfields[0] == 7 && this.flagfields[4]) {
        return null;
      } else if (this.flagfields[0] >= 8) {
        return `banner_mask_base_${this.flagfields[0]}_b`;
      } else if (this.flagfields[1] <= 4) {
        return `banner_mask_shape_${this.flagfields[1]}`;
      } else {
        return null;
      }
    }
  },
  methods: {
    click() {
      this.$emit("click", this.data);
    },
    mouseenter() {
      this.$emit("mouseenter", this.data);
    },
    mouseleave() {
      this.$emit("mouseleave", this.data);
    }    
  }
}
</script>

<style scoped>
polygon {
  cursor: pointer;
  &.hovered, &.selected {
    pointer-events: none;  
  }
}
.hexagon.area.selected {
  /* transform: scale(2); */
  animation: 800ms ease-in-out 0ms infinite running pulse;
}

image {
  pointer-events: none;
}
</style>
