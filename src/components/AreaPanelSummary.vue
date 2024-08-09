<template>
  <div class="area-panel-reports">
    <div class="parchment"></div>

    <div v-if="activePanel == 'tradePolicy'" class="area-panel-details">
      <button class="icon" @click="ShowPanel('')"><BackIcon /></button>
      <div class="area-panel-report-title">Trade Policy</div>
      <div class="area-panel-report-details-form">
        <TradePolicy
          :area="SelectedHex"
          resource="food"
          @click="SetTradePolicy" />
        <TradePolicy
          :area="SelectedHex"
          resource="goods"
          @click="SetTradePolicy" />
      </div>
    </div>

    <div v-if="activePanel == 'hireAgent'" class="area-panel-details">
      <button class="icon" @click="ShowPanel('')"><BackIcon /></button>
      <div class="area-panel-report-title">Hire Agent</div>
      <div class="area-panel-report-details-form">
        <HireAgent :area="SelectedHex" @click="SetHireAgent" />
      </div>
    </div>

    <div v-if="activePanel == ''" class="area-panel-reports-container">
      <div
        v-if="!SelectedHex.province && SelectedHex.name"
        class="area-panel-report">
        <label>Capital</label>
        <div class="field">
          <Link
            :x="SelectedHex.x"
            :y="SelectedHex.y"
            :name="SelectedHex.name"
            @click="SelectArea"
            @mouseenter="HighlightArea"
            @mouseleave="UnhighlightArea" />
        </div>
      </div>
      <div v-else-if="SelectedHex.name" class="area-panel-report">
        <label>Name</label>
        <div class="field">{{ SelectedHex.name }}</div>
      </div>
      <div class="area-panel-report">
        <label>Terrain</label>
        <div class="field">{{ SelectedHex.terrain }}</div>
      </div>
      <div v-if="SelectedHex.owner" class="area-panel-report">
        <label>Owner</label>
        <div class="field">{{ empireName }}</div>
      </div>
      <div v-if="SelectedHex.province" class="area-panel-report">
        <label>Province</label>
        <div class="field">
          <Link
            :x="SelectedHex.province.x"
            :y="SelectedHex.province.y"
            :name="SelectedHex.province.name"
            @click="SelectArea"
            @mouseenter="HighlightArea"
            @mouseleave="UnhighlightArea" />
        </div>
      </div>
      <div v-if="SelectedHex.trade" class="area-panel-report">
        <label>Region</label>
        <div class="field">
          <Link
            :x="SelectedHex.trade.x"
            :y="SelectedHex.trade.y"
            :name="SelectedHex.trade.name"
            @click="SelectArea"
            @mouseenter="HighlightArea"
            @mouseleave="UnhighlightArea" />
        </div>
      </div>

      <div
        v-if="SelectedHex?.trade_policy"
        class="area-panel-report"
        :class="ownedByMe ? 'has-details' : ''"
        @click="ownedByMe ? ShowPanel('tradePolicy') : null">
        <div class="area-panel-report-entries">
          <div class="area-panel-report-title">Trade Policy <OrderIcon /></div>
          <div
            v-if="SelectedHex.trade_policy.food"
            class="area-panel-report-entry policy-food">
            <div class="area-panel-report-entry-title">Food</div>
            <div class="area-panel-report-entry-value">
              {{ report.TradePolicy(SelectedHex, 'food') }}
            </div>
          </div>
          <div
            v-if="SelectedHex.trade_policy.goods"
            class="area-panel-report-entry policy-goods">
            <div class="area-panel-report-entry-title">Goods</div>
            <div class="area-panel-report-entry-value">
              {{ report.TradePolicy(SelectedHex, 'goods') }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="SelectedHex?.has_population"
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
          <div v-if="SelectedHex.hire_cost" class="area-panel-report-entry">
            <div class="area-panel-report-entry-title">Cost</div>
            <div class="area-panel-report-entry-value">
              {{ SelectedHex.hire_cost }}g
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Link from './Link.vue';
import TradePolicy from './TradePolicy.vue';
import HireAgent from './HireAgent.vue';
import BackIcon from '@/assets/icons/back.svg';
import OrderIcon from '../assets/icons/order.svg';
import { Coord } from '@/libs/HexUtils';

import { useReportStore } from '@/stores/ReportStore';

const report = useReportStore();

const activePanel = ref('');

const SelectedHex = computed(() => report.selectedHex);

const empireName = computed(() => {
  if (!SelectedHex.value.owner) return 'Unowned';
  if (ownedByMe.value) return `${report.MyKingdom.name} (me)`;
  return report.Kingdom(SelectedHex.value.owner).name;
});

const ownedByMe = computed(() => {
  return SelectedHex?.value.owner == report.Me;
});

const hireAgentDesc = computed(() => {
  if (SelectedHex.value.hire_agent == 'hire') {
    return {
      label: 'Order',
      value: 'hire',
    };
  }
  return {
    label: 'Order',
    value: '-',
  };
});

watch(
  () => SelectedHex,
  (newVal, oldVal) => {
    if (newVal?.x != oldVal?.x || newVal?.y != oldVal?.y) {
      ShowPanel('');
    }
  },
  { deep: true },
);

const ShowPanel = (panel) => {
  activePanel.value = panel;
};

const HighlightArea = (coord) => {
  report.HighlightHex(coord);
};

const UnhighlightArea = () => {
  report.HighlightHex(null);
};

const SelectArea = (area) => {
  report.SelectArea(area);
};

const SetTradePolicy = (params) => {
  const coord = Coord(SelectedHex.value.x, SelectedHex.value.y);
  let order = {
    food: report.TradePolicy(SelectedHex.value, 'food'),
    goods: report.TradePolicy(SelectedHex.value, 'goods'),
  };

  if (params.resource == 'food') {
    order.food = params.value;
  } else if (params.resource == 'goods') {
    order.goods = params.value;
  }

  report.AddHexOrder(coord, 'set_trade_policy', order);
};

const SetHireAgent = (params) => {
  // SelectedHex.hire_agent = params.value;
  // emit('updated', SelectedHex);
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
