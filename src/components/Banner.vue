<template>
  <g
    :transform="transform"
    :transform-origin="transformOrigin"
    class="banner"
    @click="click"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  > 
    <path fill="#000000" d="M 0,0 H 16 V 2 H 0 Z" />
    <path stroke="#000000" stroke-width="2" fill="none" d="M 8,-1 V 34" />
    <path :fill="color1" d="M 0,2 H 16 V 32 L 8,25 0,32 Z" />
    <path
      :fill="color2"
      d="M 0,2 H 16 V 32 L 8,25 0,32 Z"
      :mask="`url(#${mask1})`"
    />
    <path
      v-if="mask2"
      :fill="color3"
      d="M 0,2 H 16 V 32 L 8,25 0,32 Z"
      :mask="`url(#${mask2})`"
    />
  </g>
</template>

<script>
import { Colors1, Colors2, Colors3 } from "@/libs/BannerColors.js";

export default {
  props: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    flag: {
      type: String,
      default: "01234",
      required: true,
    },
    scale: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      Colors1: Colors1,
      Colors2: Colors2,
      Colors3: Colors3,
    };
  },
  emits: ["click", "mouseenter", "mouseleave"],
  computed: {
    transform() {
      return `scale(${this.scale}) translate(${this.x},${this.y})`;
    },
    transformOrigin() {
      return `${Math.round(this.x)}px ${Math.round(this.y)}px`;
    },
    flagfields() {
      return this.flag.split("");
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
      } else if (
        this.flagfields[0] >= 5 &&
        this.flagfields[0] <= 6 &&
        this.flagfields[1] == 4
      ) {
        return `banner_mask_base_${this.flagfields[0]}xx`;
      } else if (
        this.flagfields[0] >= 5 &&
        this.flagfields[0] <= 6 &&
        this.flagfields[1] < 4
      ) {
        return `banner_mask_base_${this.flagfields[0]}x`;
      } else {
        return `banner_mask_base_${this.flagfields[0]}`;
      }
    },
    mask2() {
      if (this.flagfields[0] == 6) {
        return null;
      } else if (this.flagfields[0] == 7 && this.flagfields[1] == 4) {
        return null;
      } else if (this.flagfields[0] == 0 && this.flagfields[1] == 3) {
        return null;
      } else if (this.flagfields[0] >= 8) {
        return `banner_mask_base_${this.flagfields[0]}_b`;
      } else if (this.flagfields[1] <= 4) {
        return `banner_mask_shape_${this.flagfields[1]}`;
      } else {
        return null;
      }
    },
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
