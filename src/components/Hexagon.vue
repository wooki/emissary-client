<template>
  <g>
    <polygon
      :transform-origin="transformOrigin"
      :class="getClass"
      :stroke="stroke"
      :stroke-width="strokeWidth"
      :fill="fill"
      :points="drawPoints"
      :stroke-dasharray="strokeDashArray"
      :filter="desaturate ? `url('#desaturate')` : ''"
      @click="click"
      @mouseenter="mouseenter"
      @mouseleave="mouseleave" />
    <!-- <text :x="points[0].x" :y="points[0].y">{{ coord }}</text> -->
    <image
      v-if="terrain == 'town'"
      :x="points[5].x"
      :y="points[0].y"
      href="../assets/icons/town.png"
      :width="points[1].x - points[5].x"
      :filter="desaturate ? `url('#desaturate')` : ''" />
    <image
      v-if="terrain == 'city'"
      :x="points[5].x"
      :y="points[0].y"
      href="../assets/icons/city.png"
      :width="points[1].x - points[5].x"
      :filter="desaturate ? `url('#desaturate')` : ''" />
  </g>
</template>

<script>
export default {
  props: {
    coord: {
      type: String,
      default: '',
    },
    terrain: {
      type: String,
      default: 'lowland',
    },
    stroke: {
      type: String,
      default: '#000',
    },
    strokeWidth: {
      type: String,
      default: '1',
    },
    strokeDashArray: {
      type: String,
      default: '0',
    },
    fill: {
      type: String,
      default: '#fff',
    },
    points: {
      type: Array,
      required: true,
    },
    data: {
      type: Object,
    },
    center: {
      type: Object,
    },
    desaturate: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click', 'mouseenter', 'mouseleave'],
  computed: {
    drawPoints() {
      return this.points
        .slice(0, 6)
        .map((p) => `${p.x},${p.y}`)
        .join(' ');
    },
    getClass() {
      return `hexagon area ${this.terrain}`;
    },
    transformOrigin() {
      if (!this.center) return '50% 50%';
      return `${Math.round(this.center.x)}px ${Math.round(this.center.y)}px`;
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
polygon {
  cursor: pointer;
  &.hovered,
  &.selected {
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
