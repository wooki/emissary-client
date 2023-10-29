<template>
  <div class="area-panel">
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
    <div v-if="area.store" class="store">
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
    </div>
    <!-- {{ JSON.stringify(area) }} -->
    
     
    
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
  
</style>
