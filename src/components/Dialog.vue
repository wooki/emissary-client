<template>
  <div ref="dialog" class="dialog" popover="manual">
    <button class="close icon" @click="close"><CloseIcon /></button>
    <div class="content">
      <div class="parchment"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import CloseIcon from '../assets/icons/close.svg';

export default {
  components: {
    CloseIcon,
  },
  methods: {
    open() {
      this.$refs.dialog.showPopover();
    },
    close() {
      this.$refs.dialog.hidePopover();
    },
  },
};
</script>

<style scoped>
.dialog::backdrop {
  background-color: rgba(43, 32, 28, 0.66);
}
.dialog {
  background-color: transparent;
  color: var(--color-text);
  min-width: 300px;
  padding: 10px 15px 15px 15px;
  border: 2px solid var(--color-dark-bg);
  border-radius: 4px;
}

.close {
  background-color: transparent;
  color: var(--color-text);
  position: absolute;
  top: 4px;
  right: 2px;
  cursor: pointer;
  &:hover,
  &:focus-visible {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--color-text);
  }
}
</style>
