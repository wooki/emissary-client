<template>
  <SelectOptions
    class="select-options"
    :data="area"
    :options="options"
    :current="current"
    @click="SetPolicy" />
</template>

<script setup>
import { computed, ref } from 'vue';
import { useReportStore } from '@/stores/reportStore';
import SelectOptions from './SelectOptions.vue';

const emit = defineEmits(['click']);

const reportStore = useReportStore();
const area = computed(() => reportStore.selectedHex);

const hireMessage = computed(() => {
  return area.value.hire_cost
    ? `Hire an agent for ${area.value.hire_cost}g for 12 turns.`
    : `Hire an agent at market value for 12 turns.`;
});

const options = ref([
  {
    value: '',
    title: 'None',
    desc: `Do not hire.`,
  },
  {
    value: 'hire',
    title: 'Hire',
    desc: hireMessage,
  },
]);

const current = computed(() => reportStore.HireAgent(area.value));

const SetPolicy = (params) => {
  emit('click', { area: area.value, value: params.value });
};
</script>
