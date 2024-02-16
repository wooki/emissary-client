<template>
  <div class="select-options">
    <div v-if="title" class="select-options-title">{{ title }}</div>
    <div :class="current == option.value ? 'active' : ''" v-for="option in options" :key="option.value" class="select-option" @click="SetOption(option)">
      <div class="select-option-title">{{  option.title }}</div>
      <div class="select-option-description">{{ option.desc }}</div>
    </div>    
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
    },
    current: {
      type: [String, Number, Boolean, Object],
      required: true,
    },
    options:{
      type: Array,
      required: true
    },
    data: {
      type: Object
    }
  },
  emits: ["click"],
  methods: {
    SetOption(option) {
      this.$emit("click", { data: this.data, title: this.title, value: option.value });
    },
  },
};
</script>

