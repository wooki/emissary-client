<template>
  <div class="area-panel">
    <AreaPanelSummary :area="area" />

    <div class="area-panel-info">

    </div>

    <div class="area-panel-features">

    </div>

    <!-- <div v-if="area.store" class="store">
      <div class="food">food: {{  area.store.food }}</div>
      <div class="goods">goods: {{  area.store.goods }}</div>
      <div class="gold">gold: {{  area.store.gold }}</div>      
    </div>
    <div v-if="area.wealth" class="wealth">Wealth: {{  area.wealth }}</div>

    <div v-if="area.info">
      <div class="info-item" v-for="(item, itemIndex) in area.info" :key="itemIndex">
        <div class="info-level">{{  item.level }}</div>
        <div class="info-type">{{  item.type }}</div>
        <div class="info-message">{{  item.message }}</div>
        <div class="info-data">{{  JSON.stringify(item.data) }}</div>
      </div>
    </div> -->
    <!-- {{ JSON.stringify(area) }} -->
    
     
    
  </div>
</template>

<script>
import AreaPanelSummary from './AreaPanelSummary.vue'

export default {
  props: {
    area: {
      type: Object,
      required: true
    }
  },
  components: {    
    AreaPanelSummary
  },
  methods: {
    
  }
}
</script>

<style scoped>
  .area-panel {
    display: grid;
    grid-template-columns: 1fr 3fr 3fr;       
    grid-template-rows: 1fr; 
    gap: 12px;
    height: 100%;    
  }

  .area-panel-summary {
    min-width: 200px;
    background-color: aqua;
  }

  .area-panel-info {
    background-color: bisque;
  }

  .area-panel-features {
    background-color: cornflowerblue;
  }

  @media (min-aspect-ratio: 1.2/1) {
    .area-panel {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 3fr 3fr;      
      gap: 24px;
    }
    .area-panel-summary {
      min-width: unset;    
      min-height: 100px;
    }

    .area-panel-info {
      min-height: 150px;
    }

    .area-panel-features {           
      min-height: 150px;          
    }
  }
</style>
