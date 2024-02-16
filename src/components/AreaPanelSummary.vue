<template>
  <div class="area-panel-reports">
    
    <div class="parchment"></div>

      <div v-if="activePanel == 'tradePolicy'" class="area-panel-details">
        <button class="icon" @click="ShowPanel('')"><BackIcon /></button>
        <div class="area-panel-report-title">Trade Policy</div>
        <div class="area-panel-report-details-form">          
          <TradePolicy :area="area" resource="food" @click="SetTradePolicy" />
          <TradePolicy :area="area" resource="goods" @click="SetTradePolicy" />
        </div>
      </div>

      <div v-if="activePanel == 'hireAgent'" class="area-panel-details">
        <button class="icon" @click="ShowPanel('')"><BackIcon /></button>
        <div class="area-panel-report-title">Hire Agent</div>
        <div class="area-panel-report-details-form">          
          <HireAgent :area="area" @click="SetHireAgent" />
        </div>
      </div>

  <div v-if="activePanel ==''" class="area-panel-reports-container">


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
    
    <div v-if="area?.trade_policy" @click="ShowPanel('tradePolicy')" class="area-panel-report" :class="ownedByMe ? 'has-details' : ''">
      <div class="area-panel-report-entries">
        <div class="area-panel-report-title">Trade Policy <OrderIcon /></div>
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

    <div v-if="area?.has_population" @click="ShowPanel('hireAgent')" class="area-panel-report has-details">
      <div class="area-panel-report-entries">
        <div class="area-panel-report-title">Hire Agent <OrderIcon /></div>
        <div class="area-panel-report-entry" v-if="area.hire_cost">
          <div class="area-panel-report-entry-title">Cost</div>
          <div class="area-panel-report-entry-value">{{ area.hire_cost }}g</div>
        </div>        
      </div>
    </div>    
    
  </div>
  </div>
</template>

<script>
import Link from './Link.vue';
import TradePolicy from './TradePolicy.vue';
import HireAgent from './HireAgent.vue';
import BackIcon from "@/assets/icons/back.svg";
import OrderIcon from "../assets/icons/order.svg";

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
    TradePolicy,
    HireAgent,
    OrderIcon
  },
  emits: ["select", "updated"],
  data() {
    return {
      activePanel: ""      
    }
  },
  computed: {
    empireName() {
      if (!this.area.owner) return "Unowned";
      if (this.ownedByMe) return `${this.report.MyKingdom()} (me)`;
      return this.report.kingdoms[this.area.owner].name;
    },
    ownedByMe() {
      return (this.area?.owner == this.report.Me());
    }
  },
  methods: {
    ShowPanel(panel) {
      this.activePanel = panel;
    },  
    Updated(area) {
      this.$emit("updated", area);
    },  
    SelectArea(area) {
      this.$emit("select", area);
    },
    SetTradePolicy(params) {
      this.area.trade_policy[params.resource] = params.value;      
      this.$emit("updated", this.area);
    },
    SetHireAgent(params) {
      this.area.hire_agent = params.value
      this.$emit("updated", this.area);
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
