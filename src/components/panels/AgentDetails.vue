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
        @click="ToggleRetire">
        <div class="area-panel-report-title">
          <span>PAYROLL</span><OrderIcon />
        </div>
        <div v-if="retire" class="area-panel-long-value">
          <RetireIcon /><span>Retiring</span>
        </div>
        <div v-else class="area-panel-long-value">Active</div>
      </div>

      <div
        class="area-panel-report-base"
        v-for="(message, messageIndex) in agent.messages"
        :key="messageIndex">
        <div class="area-panel-report-title">
          Report from {{ message.from }}
        </div>
        <div class="area-panel-long-value">{{ message.message }}</div>
      </div>
    </div>

    <div class="area-panel-report-orders"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import OrderIcon from '@/assets/icons/order.svg';
import RetireIcon from '@/assets/icons/retire.svg';
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

const retire = computed(() => {
  return reportStore.ExistingAgentOrder(
    SelectedHex.value,
    props.agent?.id,
    'retire',
  ).retire;
});

function ToggleRetire() {
  reportStore.AddAgentOrder(coord, props.agent?.id, 'retire', {
    retire: !retire.value,
  });
}
</script>

<style scoped></style>
