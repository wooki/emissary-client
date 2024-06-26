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

    <div v-if="activePanel == ''" class="area-panel-reports-container">
      <div v-if="!area.province && area.name" class="area-panel-report">
        <label>Capital</label>
        <div class="field">
          <Link
            :x="area.x"
            :y="area.y"
            :name="area.name"
            @click="SelectArea"
            @mouseenter="HighlightArea"
            @mouseleave="UnhighlightArea" />
        </div>
      </div>
      <div v-else-if="area.name" class="area-panel-report">
        <label>Name</label>
        <div class="field">{{ area.name }}</div>
      </div>
      <div class="area-panel-report">
        <label>Terrain</label>
        <div class="field">{{ area.terrain }}</div>
      </div>
      <div v-if="area.owner" class="area-panel-report">
        <label>Owner</label>
        <div class="field">{{ empireName }}</div>
      </div>
      <div v-if="area.province" class="area-panel-report">
        <label>Province</label>
        <div class="field">
          <Link
            :x="area.province.x"
            :y="area.province.y"
            :name="area.province.name"
            @click="SelectArea"
            @mouseenter="HighlightArea"
            @mouseleave="UnhighlightArea" />
        </div>
      </div>
      <div v-if="area.trade" class="area-panel-report">
        <label>Region</label>
        <div class="field">
          <Link
            :x="area.trade.x"
            :y="area.trade.y"
            :name="area.trade.name"
            @click="SelectArea"
            @mouseenter="HighlightArea"
            @mouseleave="UnhighlightArea" />
        </div>
      </div>

      <div
        v-if="area?.trade_policy"
        class="area-panel-report"
        :class="ownedByMe ? 'has-details' : ''"
        @click="ShowPanel('tradePolicy')">
        <div class="area-panel-report-entries">
          <div class="area-panel-report-title">Trade Policy <OrderIcon /></div>
          <div
            v-if="area.trade_policy.food"
            class="area-panel-report-entry policy-food">
            <div class="area-panel-report-entry-title">Food</div>
            <div class="area-panel-report-entry-value">
              {{ area.trade_policy.food }}
            </div>
          </div>
          <div
            v-if="area.trade_policy.goods"
            class="area-panel-report-entry policy-goods">
            <div class="area-panel-report-entry-title">Goods</div>
            <div class="area-panel-report-entry-value">
              {{ area.trade_policy.goods }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="area?.has_population"
        class="area-panel-report has-details"
        @click="ShowPanel('hireAgent')">
        <div class="area-panel-report-entries">
          <div class="area-panel-report-title">Hire Agent <OrderIcon /></div>
          <div v-if="hireAgentDesc" class="area-panel-report-entry">
            <div class="area-panel-report-entry-title">
              {{ hireAgentDesc.label }}
            </div>
            <div class="area-panel-report-entry-value">
              {{ hireAgentDesc.value }}
            </div>
          </div>
          <div v-if="area.hire_cost" class="area-panel-report-entry">
            <div class="area-panel-report-entry-title">Cost</div>
            <div class="area-panel-report-entry-value">
              {{ area.hire_cost }}g
            </div>
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
import BackIcon from '@/assets/icons/back.svg';
import OrderIcon from '../assets/icons/order.svg';

export default {
  components: {
    Link,
    BackIcon,
    TradePolicy,
    HireAgent,
    OrderIcon,
  },
  props: {
    report: {
      type: Object,
      required: true,
    },
    area: {
      type: Object,
      required: true,
    },
  },
  emits: ['select', 'updated', 'highlight'],
  data() {
    return {
      activePanel: '',
    };
  },
  computed: {
    empireName() {
      if (!this.area.owner) return 'Unowned';
      if (this.ownedByMe) return `${this.report.MyKingdom()} (me)`;
      return this.report.kingdoms[this.area.owner].name;
    },
    ownedByMe() {
      return this.area?.owner == this.report.Me();
    },
    hireAgentDesc() {
      if (this.area.hire_agent == 'hire') {
        return {
          label: 'Order',
          value: 'hire',
        };
      }
      return {
        label: 'Order',
        value: '-',
      };
    },
  },
  watch: {
    area(newVal, oldVal) {
      if (newVal?.x != oldVal?.x || newVal?.y != oldVal?.y) {
        this.ShowPanel('');
      }
    }
  },
  methods: {
    ShowPanel(panel) {
      this.activePanel = panel;
    },
    Updated(area) {
      this.$emit('updated', area);
    },
    HighlightArea(coord) {
      this.$emit('highlight', coord);
    },
    UnhighlightArea() {
      this.$emit('highlight', null);
    },
    SelectArea(area) {
      this.$emit('select', area);
    },
    SetTradePolicy(params) {
      this.area.trade_policy[params.resource] = params.value;
      this.$emit('updated', this.area);
    },
    SetHireAgent(params) {
      this.area.hire_agent = params.value;
      this.$emit('updated', this.area);
    },
  },
};
</script>

<style scoped>
.area-panel-report-details-form {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
}
</style>
