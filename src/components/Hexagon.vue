<template>
  <g>
    <polygon
      :transform-origin="transformOrigin"
      :class="getClass"
      :stroke="stroke"
      :stroke-width="notVisible ? '1' : strokeWidth"
      :fill="fill"
      :points="drawPoints"
      :stroke-dasharray="strokeDashArray"
      @click="click"
      @mouseenter="mouseenter"
      @mouseleave="mouseleave" 
      :filter="notVisible ? `url('#desaturate')` : ''"/>
      
    <!-- <text :x="points[0].x" :y="points[0].y">{{ coord }}</text> -->
    
    <use v-if="image" :transform-origin="transformOrigin" :href="`#terrain-${image}`" :x="points[5].x" :y="points[0].y" :width="points[1].x - points[5].x" :height="points[3].y - points[0].y" />

    <image
      v-if="terrain == 'town'"
      :x="points[5].x"
      :y="points[0].y"
      href="../assets/icons/town.png"
      :width="points[1].x - points[5].x"
      :filter="notVisible ? `url('#desaturate')` : ''" />
    <image
      v-if="terrain == 'city'"
      :x="points[5].x"
      :y="points[0].y"
      href="../assets/icons/city.png"
      :width="points[1].x - points[5].x"
      :filter="notVisible ? `url('#desaturate')` : ''" />
  </g>
</template>

<script setup>
import { computed } from 'vue';
import { useReportStore } from '@/stores/reportStore';

const props = defineProps({
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
    default: () => ({}),
  },
  center: {
    type: Object,
    default: () => ({}),
  },
  notVisible: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['click', 'mouseenter', 'mouseleave']);

const drawPoints = computed(() => {
  return props.points
    .slice(0, 6)
    .map((p) => `${p.x},${p.y}`)
    .join(' ');
});

const getClass = computed(() => {
  return `hexagon area ${props.terrain}`;
});

const transformOrigin = computed(() => {
  if (!props.center) return '50% 50%';
  if (!props.center.x) return '50% 50%';  
  return `${Math.round(props.center.x)}px ${Math.round(props.center.y)}px`;
});

const click = () => {
  emit('click', props.data);
};

const mouseenter = () => {
  emit('mouseenter', props.data);
};

const mouseleave = () => {
  emit('mouseleave', props.data);
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

image, use {
  pointer-events: none;
}

.order {
  fill: var(--color-crimson);
}
</style>
