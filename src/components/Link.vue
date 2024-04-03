<template>
  <button
    class="link"
    @click="Click(coord)"
    @mouseenter="MouseEnter"
    @mouseleave="MouseLeave">
    <div v-if="showCoord || !showName || !name" class="coord">{{ coord }}</div>
    <div v-if="showName && name" class="name">{{ name }}</div>
  </button>
</template>

<script>
export default {
  props: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
    stroke: {
      type: String,
      default: '#000',
    },
    showCoord: {
      type: Boolean,
      default: false,
    },
    showName: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['click', 'mouseenter', 'mouseleave'],
  computed: {
    coord() {
      return `${this.x},${this.y}`;
    },
  },
  methods: {
    Click() {
      this.$emit('click', { x: this.x, y: this.y });
    },
    MouseEnter() {
      this.$emit('mouseenter', { x: this.x, y: this.y });
    },
    MouseLeave() {
      this.$emit('mouseleave', { x: this.x, y: this.y });
    },
  },
};
</script>

<style scoped>
button.link {
  background: transparent;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  line-height: 1.3;
  gap: 0.3em;
  font-weight: unset;
  height: auto;
  border: none;
  color: var(--color-link);
  padding: 0 2px;
  border-radius: 2px;
  border: 1px solid transparent;
  transition: all 100ms ease;
  transform: translateX(-3px) translateY(-1px);
  text-align: left;
  .name {
    font-weight: bold;
  }
}

button.link:hover,
button.link:focus-visible {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-text);
}
</style>
