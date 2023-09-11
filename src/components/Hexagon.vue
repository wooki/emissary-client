<template>
  <polygon @click="click" :stroke="stroke" :strokeWidth="strokeWidth" :fill="fill" :points="drawPoints" />  
</template>

<script>
export default {
  props: {
    stroke: {
      type: String,
      default: '#000'
    },
    strokeWidth: {
      type: String,
      default: '1'
    },
    fill: {
      type: String,
      default: '#fff'
    },
    points: {
      type: Array,
      required: true
    }
  },
  emits: ["click"],
  computed: {
    drawPoints() {
      return this.points.slice(0, 6).map(p => `${p.x},${p.y}`).join(" ");
    }
  },
  methods: {
    click() {
      console.log("click");
      this.$emit("click");
    }
  }
}
</script>

<style scoped>
  
  
</style>
