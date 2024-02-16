<template>
  <SelectOptions class="trade-policy select-options" :class="`trade-policy-${resource}`" :title="resource" :data="area" :options="options" :current="current" @click="SetPolicy" />
</template>

<script>
import SelectOptions from "./SelectOptions.vue";

export default {
  props: {
    area: {
      type: Object,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    }
  },
  components: {
    SelectOptions
  },
  data() {
    return {
      options: [
        {
          value: "none",
          title: "None",
          desc: `Do not buy or sell any ${this.resource}.`
        },
        {
          value: "ration",
          title: "Ration",
          desc: `Buy/sell up to half required for upkeep/industry.`
        },
        {
          value: "trade",
          title: "Trade",
          desc: `Buy/sell up to quantity required for upkeep/industry.`
        },
        {
          value: "reserve",
          title: "Reserve",
          desc: `Buy/sell up to twice upkeep/industry.`
        },
        {
          value: "stockpile",
          title: "Stockpile",
          desc: `Buy/sell up to three times upkeep/industry.`
        },
        {
          value: "hoard",
          title: "Hoard",
          desc: `Buy/sell up to five times upkeep/industry.`
        }
      ]
    }
  },
  emits: ["click"],
  computed: {
    current() {
      return this.area.trade_policy[this.resource];
    }
  },
  methods: {
    SetPolicy(params) {
      this.$emit("click", { area: this.area, resource: this.resource, value: params.value });
    },
  },
};
</script>

