<template>
  <div class="area-panel-summary">
    <div class="parchment"></div>

    <div class="name" v-if="!area.province && area.name">
      <label>Capital</label>
      <div class="field">
        <Link @click="SelectArea" :x="area.x" :y="area.y" :name="area.name" />
      </div>
    </div>
    <div v-else-if="area.name" class="name"><label>Name</label><div class="field">{{ area.name }}</div></div>
    <div class="terrain"><label>Terrain</label><div class="field">{{ area.terrain }}</div></div>
    <div v-if="area.owner" class="owner">
      <label>Owner</label>
      <div class="field">{{  area.owner }}</div>
    </div>
    <div class="location" v-if="area.province">
      <label>Province</label>
      <div class="field">
        <Link @click="SelectArea" :x="area.province.x" :y="area.province.y" :name="area.province.name" />
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
import Link from './Link.vue'

export default {
  props: {
    area: {
      type: Object,
      required: true
    }
  },
  components: {    
    Link
  },
  emits: ["select"],
  computed: {
    population() {      
      if (this.area?.population) {
        return Rounded(this.area.population, 2).toLocaleString();
      }
      return null;
    }
  },
  methods: {
    SelectArea(area) {
      this.$emit("select", area);
    }
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
