<template>
  <div class="area-panel-reports area-panel-items">
    <div class="parchment"></div>

    <div v-if="selectedItem" class="area-panel-details">
      <button class="icon" @click="SelectItem(null)"><BackIcon /></button>

      <AgentDetails
        v-if="selectedItem.type == 'agent'"
        :agent="selectedItem"
        :report="report"
        @order="OrderAgent" />
    </div>

    <div v-else class="area-panel-reports-container area-panel-items">
      <div
        v-for="(item, itemIndex) in items"
        :key="itemIndex"
        tabindex="0"
        class="area-panel-report has-details area-panel-item"
        :class="`area-panel-${item.type}`"
        @click="SelectItem(itemIndex)"
        @keypress.enter="SelectItem(itemIndex)">
        <svg v-if="item.owner" mask="url(#agent_mask)">
          <use :href="`#agent-${item.owner}`"></use>
        </svg>
        <div class="item-summary">
          <div class="item-summary-title">{{ item.type }}</div>
          <div v-if="item.owner" class="field">
            for {{ EmpireName(item.owner) }}
          </div>
          <div v-if="item.skill" class="field">
            {{ item.range ?? '-' }}/{{ item.depth ?? '-' }}/{{
              item.skill ?? '-'
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useReportStore } from '@/stores/reportStore';
import BackIcon from '@/assets/icons/back.svg';
import OrderIcon from '../assets/icons/order.svg';
import AgentDetails from './AgentDetails.vue';

const reportStore = useReportStore();

const SelectedHex = computed(() => reportStore.selectedHex);

const selectedItemIndex = ref(null);

const selectedItem = computed(() => {
  if (selectedItemIndex.value == null) return null;
  return items.value[selectedItemIndex.value];
});

const items = computed(() => {
  const items = [];

  // get from area
  Object.keys(SelectedHex.value.agents).forEach((agentId) => {    items.push(
      Object.assign(
        {
          type: 'agent',
        },
        reportStore.currentArea.agents[agentId],
      ),
    );
  });

  // TODO: look for armies?, structures?, church? etc.

  return items;
});

watch(() => reportStore.currentArea, (newVal, oldVal) => {
  if (newVal?.x != oldVal?.x || newVal?.y != oldVal?.y) {
    selectItem(selectedItemIndex.value);
  }
}, { deep: true });

function selectItem(index) {
  if (selectedItemIndex.value == index) {
    selectedItemIndex.value = null;
  } else {
    selectedItemIndex.value = index;
  }
}

function empireName(owner) {
  if (!owner) return 'Unowned';
  if (ownedByMe(owner)) return `${reportStore.myKingdom}`;
  return reportStore.kingdoms[owner].name;
}

function ownedByMe(owner) {
  return owner == reportStore.me;
}

function orderAgent(agent) {
  reportStore.currentArea.agents[agent.id] = agent;
  reportStore.updateArea(reportStore.currentArea);
}
</script>

<style scoped></style>
