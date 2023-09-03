<template>
  <polygon :stroke="stroke" :strokeWidt="strokeWidth" :fill="fill" :points="points" />  
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
    
  },
  computed: {
    points() {
      return "100,100 150,25 150,75 200,0";
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  
  
</style>
