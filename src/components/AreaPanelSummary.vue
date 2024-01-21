<template>
  <div class="area-panel-reports">
    
    <div class="parchment"></div>

    <div v-if="showTradePolicy" class="area-panel-details">
        <button class="icon" @click="this.showTradePolicy = false"><BackIcon /></button>
        <div class="area-panel-report-title">Trade Policy</div>
        <div class="area-panel-report-details-form">          
          <TradePolicy :area="area" resource="food" @click="SetTradePolicy" />
          <TradePolicy :area="area" resource="goods" @click="SetTradePolicy" />
        </div>
      </div>
  <div v-else class="area-panel-reports-container">


    <div class="area-panel-report" v-if="!area.province && area.name">
      <label>Capital</label>
      <div class="field">
        <Link @click="SelectArea" :x="area.x" :y="area.y" :name="area.name" />
      </div>
    </div>
    <div v-else-if="area.name" class="area-panel-report"><label>Name</label><div class="field">{{ area.name }}</div></div>
    <div class="area-panel-report"><label>Terrain</label><div class="field">{{ area.terrain }}</div></div>
    <div v-if="area.owner" class="area-panel-report">
      <label>Owner</label>
      <div class="field">{{  empireName }}</div>
    </div>
    <div class="area-panel-report" v-if="area.province">
      <label>Province</label>
      <div class="field">
        <Link @click="SelectArea" :x="area.province.x" :y="area.province.y" :name="area.province.name" />
      </div>
    </div>
    <div v-if="area.trade" class="area-panel-report">
      <label>Region</label>
      <div class="field">
        <Link @click="SelectArea" :x="area.trade.x" :y="area.trade.y" :name="area.trade.name" />
      </div>
    </div>  
    
    <div v-if="area?.trade_policy" @click="ShowTradePolicy" class="area-panel-report" :class="ownedByMe ? 'has-details' : ''">
      <div class="area-panel-report-entries">
        <div class="area-panel-report-title">Trade Policy</div>
        <div class="area-panel-report-entry policy-food" v-if="area.trade_policy.food">
          <div class="area-panel-report-entry-title">Food</div>
          <div class="area-panel-report-entry-value">{{ area.trade_policy.food }}</div>
        </div>
        <div class="area-panel-report-entry policy-goods" v-if="area.trade_policy.goods">
          <div class="area-panel-report-entry-title">Goods</div>
          <div class="area-panel-report-entry-value">{{ area.trade_policy.goods }}</div>
        </div>
      </div>
    </div>    
    
  </div>
  </div>
</template>

<script>
import Link from './Link.vue'
import TradePolicy from './TradePolicy.vue'
import BackIcon from "@/assets/icons/back.svg";

export default {
  props: {
    report: {
      type: Object,
      required: true
    },
    area: {
      type: Object,
      required: true
    }
  },
  components: {    
    Link,
    BackIcon,
    TradePolicy
  },
  emits: ["select"],
  data() {
    return {
      showTradePolicy: false
    }
  },
  computed: {
    empireName() {
      if (!this.area.owner) return "Unowned";
      if (this.ownedByMe) return `Me (${this.report.MyKingdom()})`;
      return this.report.kingdoms[this.area.owner].name;
    },
    ownedByMe() {
      return (this.area?.owner == this.report.Me());
    }
  },
  methods: {
    SelectArea(area) {
      this.$emit("select", area);
    },
    ShowTradePolicy() {
      this.showTradePolicy = true;
    },
    SetTradePolicy(params) {
      this.area.trade_policy[params.resource] = params.value;      
    }
  }
}
</script>

<style scoped>  
.area-panel-report-details-form {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
}
</style>
