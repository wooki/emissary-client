<template>
  <SelectOptions class="select-options" :data="area" :options="options" :current="current" @click="SetPolicy" />
</template>

<script>
import SelectOptions from "./SelectOptions.vue";

export default {
  props: {
    area: {
      type: Object,
      required: true,
    }
  },
  components: {
    SelectOptions
  },
  data() {
    let hireMessage = `Hire an agent at market value for 12 turns.`
    if (this.area.hire_cost) {
      hireMessage = `Hire an agent for ${this.area.hire_cost}g for 12 turns.`
    }
    return {
      options: [
        {
          value: "",
          title: "None",
          desc: `Do not hire.`
        },
        {
          value: "hire",
          title: "Hire",
          desc: hireMessage
        }
      ]
    }
  },
  emits: ["click"],
  computed: {
    current() {
      return this.area.hire_agent ?? "";
    }
  },
  methods: {
    SetPolicy(params) {
      this.$emit("click", { area: this.area, value: params.value });
    },
  },
};
</script>

