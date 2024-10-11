<template>
  <g>
    <symbol
      v-for="kingdom in kingdomsArray"
      :id="'banner-' + kingdom.player"
      :key="kingdom.player"
      viewBox="8 0 16 32" height="32" width="16">
      <Banner mask="banner" :x="0" :y="0" :flag="kingdom.flag" />
    </symbol>
    <symbol id="banner-unknown" viewBox="8 0 16 32" height="32" width="16">
      <Banner mask="banner" :x="0" :y="0" flag="77777" />
    </symbol>
    <symbol
      v-for="kingdom in kingdomsArray"
      :id="'agent-' + kingdom.player"
      :key="'agent-' + kingdom.player"
      viewBox="4 4 24 24"
      height="16"
      width="16">
      <Banner mask="agent" :x="0" :y="0" :flag="kingdom.flag" />
    </symbol>
    <symbol
      id="agent-unknown"
      viewBox="4 4 24 24"
      height="16"
      width="16">
      <Banner mask="agent" :x="0" :y="0" flag="77777" />
    </symbol>
    <symbol
      v-for="kingdom in kingdomsArray"
      :id="'army-' + kingdom.player"
      :key="'army-' + kingdom.player"
      viewBox="4 2 24 30"
      height="20"
      width="16">
      <Banner mask="army" :x="0" :y="0" :flag="kingdom.flag" />
    </symbol>
    <symbol id="army-unknown" viewBox="4 2 24 30" height="20" width="16">
      <Banner mask="army" :x="0" :y="0" flag="77777" />
    </symbol>
    <symbol
      v-for="kingdom in kingdomsArray"
      :id="'ship-' + kingdom.player"
      :key="'ship-' + kingdom.player"
      viewBox="2 1 20 30"
      height="20"
      width="16">
      <Banner translation-origin="16 16" mask="ship" :x="0" :y="0" :flag="kingdom.flag" />
    </symbol>
    <symbol id="ship-unknown" viewBox="2 2 24 30" height="20" width="16">
      <Banner mask="ship" :x="0" :y="0" flag="77777" />
    </symbol>
  </g>
</template>

<script setup>
import { computed } from 'vue';
import Banner from '@/components/Banner.vue';

const props = defineProps({
  kingdoms: {
    type: Object,
    required: true,
  },
});

const kingdomsArray = computed(() => {
  return Object.values(props.kingdoms);
});
</script>
