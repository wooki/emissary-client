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
      viewBox="0 8 16 16"
      height="16"
      width="16">
      <Banner mask="agent" :x="0" :y="0" :flag="kingdom.flag" />
    </symbol>
    <symbol
      id="agent-unknown"
      viewBox="0 8 16 16"
      height="16"
      width="16">
      <Banner mask="agent" :x="0" :y="0" flag="77777" />
    </symbol>
    <symbol
      v-for="kingdom in kingdomsArray"
      :id="'army-' + kingdom.player"
      :key="'army-' + kingdom.player"
      viewBox="0 2 16 22"
      height="22"
      width="16">
      <Banner mask="army" :x="0" :y="0" :flag="kingdom.flag" />
    </symbol>
    <symbol id="army-unknown" viewBox="0 2 16 22" height="20" width="16">
      <Banner mask="army" :x="0" :y="0" flag="77777" />
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
