<template>
  <SelectOptions
    class="trade-policy select-options"
    :class="`trade-policy-${resource}`"
    :title="resource"
    :data="area"
    :options="options"
    :current="current"
    @click="SetPolicy" />
</template>

<script setup>
import { computed } from 'vue';
import { useReportStore } from '@/stores/ReportStore';
import SelectOptions from './SelectOptions.vue';

const props = defineProps({
  resource: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['click']);

const reportStore = useReportStore();
const area = computed(() => reportStore.selectedHex);

const options = computed(() =>
  reportStore.tradePolicyOptions.map((option) => ({
    ...option,
    desc: option.desc(props.resource),
  })),
);

const current = computed(() =>
  reportStore.TradePolicy(area.value, props.resource),
);

const SetPolicy = (params) => {
  emit('click', {
    area: area.value,
    resource: props.resource,
    value: params.value,
  });
};
</script>
