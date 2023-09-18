<template>
  <polygon @click="click" :stroke="stroke" :strokeWidth="strokeWidth" :fill="fill" :points="drawPoints" />  
  <!-- <text :x="points[0].x" :y="points[0].y">{{ coord }}</text> -->
  <image v-if="terrain == 'town'" :x="points[5].x" :y="points[0].y" href="../assets/icons/town.png" :width="(points[1].x - points[5].x)"/>
  <image v-if="terrain == 'city'" :x="points[5].x" :y="points[0].y" href="../assets/icons/city.png" :width="(points[1].x - points[5].x)"/>
</template>

<script>
export default {
  props: {
    coord: {
      type: String,
      default: ''
    },
    terrain: {
      type: String,
      default: 'lowland'
    },
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
