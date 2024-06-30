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

    <div class="area-panel-report-base has-details" v-if="ownedByMe" @click="ToggleWillPay">      
      <div class="area-panel-report-title"><span>WILL RENEW</span><OrderIcon /></div>
      <div class="area-panel-report-value">{{ willPay ? "YES" : "NO" }}</div>
    </div>
  </div>

    <div class="area-panel-report-orders"></div>
  </div>
</template>

<script>
import OrderIcon from '../assets/icons/order.svg';

export default {
  props: {
    agent: {
      type: Object,
      required: true,
    },
    report: {
      type: Object,
      required: true,
    },    
  },
  components: {
    OrderIcon
  },
  emits: ['order'],
  computed: {
    ownedByMe() {
      return this.agent?.owner == this.report.Me();
    },
    willPay() {
      if (this.agent['set_will_pay'] != undefined) {
        return this.agent['set_will_pay'];
      }
      return this.agent.will_pay;
    }    
  },
  methods: {
    ToggleWillPay() {
      this.agent['set_will_pay'] = !this.willPay;
      this.$emit('order', this.agent);
    }
  },
  mounted() {
    console.log("agent", this.agent);
  }
};
</script>

<style scoped></style>
