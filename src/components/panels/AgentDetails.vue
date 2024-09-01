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

const reportStore = useReportStore();

const props = defineProps({
  agent: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['order']);

const ownedByMe = computed(() => props.agent?.owner == reportStore.Me);

const willPay = computed(() => {
  if (props.agent['set_will_pay'] != undefined) {
    return props.agent['set_will_pay'];
  }
  return props.agent.will_pay;
});

function ToggleWillPay() {
  props.agent['set_will_pay'] = !willPay.value;
  emit('order', props.agent);
}

onMounted(() => {
  console.log('agent', props.agent);
});
</script>

<style scoped></style>
