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
  </div>

    <div class="area-panel-report-orders"></div>
  </div>
</template>

<script>
export default {
  props: {
    agent: {
      type: Object,
      required: true,
    },
  },
  emits: ['order'],
  methods: {},
};
</script>

<style scoped></style>
