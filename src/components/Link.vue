<template>
  <button class="link" @click="Click(coord)">
    <ProvinceIcon />
    <div class="coord" v-if="showCoord || !showName || !name">{{ coord }}</div>
    <div class="name" v-if="showName && name">{{ name }}</div>
  </button>
</template>

<script>
import ProvinceIcon from '@/assets/icons/town.svg'

export default {
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      default: ''
    },
    stroke: {
      type: String,
      default: '#000'
    },
    showCoord: {
      type: Boolean,
      default: false
    },
    showName: {
      type: Boolean,
      default: true
    },
    showIcon: {
      type: Boolean,
      default: true
    }    
  },
  components: {
    ProvinceIcon
  },
  emits: ["click"],
  computed: {
    coord() {
      return `${this.x},${this.y}`
    }
  },
  methods: {
    Click() {
      this.$emit("click", {x: this.x, y: this.y});
    }
  }
}
</script>

<style scoped>
  button.link {
    background: transparent;
    padding: 0;
    color: var(--color-text);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    line-height: 1.3;
    gap: 0.3em;
    font-weight: unset;
    height: auto;

    &:has(svg) {
      gap: 0;
    }
    svg {
      transform: translateY(-7%);
      height: 1.2em;
      width: 1.2em;
    }
  }
</style>
