<template>
  <div class="trade-policy select-options" :class="`trade-policy-${resource}`">
    <div class="select-options-title">{{ resource }}</div>
    <div :class="current == option.value ? 'active' : ''" v-for="option in options" :key="option.value" class="select-option" @click="SetPolicy(option)">
      <div class="select-option-title">{{  option.title }}</div>
      <div class="select-option-description">{{ option.desc }}</div>
    </div>    
  </div>
</template>

<script>
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
  data() {
    return {
      options: [
        {
          value: "none",
          title: "None",
          desc: `Do not buyor sell any ${this.resource}.`
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
    SetPolicy(option) {
      this.$emit("click", { area: this.area, resource: this.resource, value: option.value });
    },
  },
};
</script>

