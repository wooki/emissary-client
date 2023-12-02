<template>
  <div class="area-panel-summary">

    <div class="terrain">{{  area.terrain }}</div>
    <div v-if="area.owner" class="owner">Owner: {{  area.owner }}</div>
    <div class="location">
      <div class="coord">{{  area.x }}, {{  area.y }}</div>
      <div class="province">{{ area.province ? area.province.name : area.name}}</div>
    </div>
    <div v-if="area.trade" class="trade">
      <div class="coord">{{  area.trade.x }}, {{  area.trade.y }}</div>
      <div class="province">{{ area.trade.name}}</div>
    </div>
    
  </div>
</template>

<script>
export default {
  props: {
    area: {
      type: Object,
      required: true
    }
  },
  components: {    
    
  },
  methods: {
    
  }
}
</script>

<style scoped>
  .area-panel-summary {
    
  }

  @media (min-aspect-ratio: 1.2/1) {
    .area-panel-summary {
    }

  }
</style>
