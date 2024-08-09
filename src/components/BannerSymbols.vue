<template>
  <g>
    <symbol
      v-for="kingdom in kingdomsArray"
      :id="'banner-' + kingdom.player"
      :key="kingdom.player"
      viewBox="0 -1 16 34"
      height="35"
      width="16">
      <Banner :x="0" :y="0" :flag="kingdom.flag" />
    </symbol>
    <symbol id="banner-unknown" viewBox="0 -1 16 34" height="35" width="16">
      <Banner :x="0" :y="0" flag="77777" />
    </symbol>
    <symbol
      v-for="kingdom in kingdomsArray"
      :id="'agent-' + kingdom.player"
      :key="'agent-' + kingdom.player"
      viewBox="0 8 16 16"
      height="16"
      width="16"
      mask="url(#agent_mask)">
      <Banner :x="0" :y="0" :flag="kingdom.flag" />
    </symbol>
    <symbol
      id="agent-unknown"
      viewBox="0 8 16 16"
      height="16"
      width="16"
      mask="url(#agent_mask)">
      <Banner :x="0" :y="0" flag="77777" />
    </symbol>
    <symbol
      v-for="kingdom in kingdomsArray"
      :id="'army-' + kingdom.player"
      :key="'army-' + kingdom.player"
      viewBox="0 2 16 22"
      height="22"
      width="16"
      mask="url(#army_mask)">
      <Banner :x="0" :y="0" :flag="kingdom.flag" />
    </symbol>
    <symbol id="army-unknown" viewBox="0 2 16 22" height="20" width="16">
      <Banner :x="0" :y="0" flag="77777" />
    </symbol>
  </g>
</template>

<script setup>
import { computed } from 'vue';
import Banner from './Banner.vue';

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
