<template>
  <symbol v-for="type in terrain" :key="type" :id="'terrain-' + type" viewBox="0 0 420 480">
    <image :href="`/hextiles/${tileset}/${type}.png`" width="420" height="480" />
  </symbol>  
</template>

<script setup>
import { defineProps, onMounted } from 'vue';

const props = defineProps({
  tileset: {
    type: String,
    required: true
  },
  terrain: {
    type: Array,
    default: () => [
      'peak',
      'ocean',
      'mountain',
      'lowland',
      'forest',
      'desert',
      'town',
      'city',
      'unknown'
    ]
  },
});


</script>

