<template>
  <div class="area-panel-report area-panel-item-details area-panel-agent">
    <div class="area-panel-report-title">Agent</div>

    <div class="area-panel-reports-container">
      <div class="area-panel-report-base" v-if="agent.range">
        <div class="area-panel-report-title">RANGE</div>
        <div class="area-panel-report-value">{{ agent.range }}</div>
      </div>

      <div class="area-panel-report-base" v-if="agent.depth">
        <div class="area-panel-report-title">DEPTH</div>
        <div class="area-panel-report-value">{{ agent.depth }}</div>
      </div>

      <div class="area-panel-report-base" v-if="agent.skill">
        <div class="area-panel-report-title">SKILL</div>
        <div class="area-panel-report-value">{{ agent.skill }}</div>
      </div>

      <div class="area-panel-report-base" v-if="agent.cost">
        <div class="area-panel-report-title">COST</div>
        <div class="area-panel-report-value">{{ agent.cost }}</div>
      </div>

      <div class="area-panel-report-base" v-if="agent.next_payment">
        <div class="area-panel-report-title">PAY ON TURN</div>
        <div class="area-panel-report-value">{{ agent.next_payment }}</div>
      </div>

      <div
        class="area-panel-report-base has-details"
        v-if="ownedByMe"
        @click="ToggleWillPay">
        <div class="area-panel-report-title">
          <span>WILL RENEW</span><OrderIcon />
        </div>
        <div class="area-panel-report-value">{{ willPay ? 'YES' : 'NO' }}</div>
      </div>
    </div>

    <div class="area-panel-report-orders"></div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import OrderIcon from '@/assets/icons/order.svg';
import { useReportStore } from '@/stores/reportStore';
import { Coord } from '@/libs/HexUtils';

const reportStore = useReportStore();

const props = defineProps({
  agent: {
    type: Object,
    required: true,
  },
});

const SelectedHex = computed(() => reportStore.selectedHex);
const coord = Coord(SelectedHex.value.x, SelectedHex.value.y);  

const ownedByMe = computed(() => props.agent?.owner == reportStore.Me);

const willPay = computed(() => {
  return reportStore.ExistingAgentOrder(SelectedHex.value, props.agent?.id, "set_will_pay").will_pay;
});
console.log("willPay", willPay.value);

  
function ToggleWillPay() {
  reportStore.AddAgentOrder(coord, props.agent?.id, "set_will_pay", { will_pay: !willPay.value });
}

onMounted(() => {
  console.log('agent', props.agent);
});
</script>

<style scoped></style>
