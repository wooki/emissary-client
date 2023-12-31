<template>
  <div class="area-panel-summary">
    <div class="parchment"></div>

    <div v-if="area.name" class="name"><label>Name</label><div class="field">{{ area.name }}</div></div>
    <div class="terrain"><label>Terrain</label><div class="field">{{ area.terrain }}</div></div>
    <div v-if="area.owner" class="owner">
      <label>Owner</label>
      <div class="field">{{  area.owner }}</div>
    </div>
    <div class="location">
      <label>Province</label>
      <div class="field">
        <div class="coord">{{  area.x }}, {{  area.y }}</div>
        <div class="province">{{ area.province ? area.province.name : area.name}}</div>
      </div>
    </div>
    <div v-if="area.trade" class="trade">
      <label>Trade Region</label>
      <div class="field">
        <div class="coord">{{  area.trade.x }}, {{  area.trade.y }}</div>
        <div class="province">{{ area.trade.name}}</div>
      </div>
    </div>
    <div v-if="area.population">
      <label>Population</label>
      <div class="field">{{ population }}</div>
    </div>
    
  </div>
</template>

<script>
import { Rounded } from '@/libs/SafeMath.js'

export default {
  props: {
    area: {
      type: Object,
      required: true
    }
  },
  components: {    
    
  },
  computed: {
    population() {      
      if (this.area?.population) {
        return Rounded(this.area.population, 2).toLocaleString();
      }
      return null;
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
  .area-panel-summary {
    position: relative;
    z-index: 1;    
    padding: 10px 12px;
    font-size: 12px; 
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;

    label {      
      font-weight: bold;
      text-transform: uppercase;
      display: block;
      width: 100%;
    }

    .name {
      .field {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }

  @media (min-aspect-ratio: 1.2/1) {
    .area-panel-summary {
    }

  }
</style>
