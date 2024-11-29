<template>
  <symbol
    v-for="type in terrainWithVariants"
    :key="type"
    :id="'terrain-' + type"
    viewBox="0 0 420 480">
    <image
      :key="type"
      :href="`/hextiles/${type}.png`"
      width="420"
      height="480" />
  </symbol>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
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
      'unknown',
    ],
  },
  terrainVariants: {
    type: Object,
    default: () => ({
      peak: 0,
      ocean: 0,
      mountain: 0,
      lowland: 0,
      forest: 0,
      desert: 0,
      town: 0,
      city: 0,
      unknown: 0,
    }),
  },
});

const terrainWithVariants = computed(() => {
  return props.terrain.reduce((acc, type) => {
    const variantCount = props.terrainVariants[type];
    if (variantCount > 0) {
      const variants = Array.from(
        { length: variantCount },
        (_, i) => `${type}${i + 1}`,
      );
      acc.push(...variants);
    }
    return acc;
  }, []);
});
</script>
