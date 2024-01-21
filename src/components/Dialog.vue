<template>
    <div ref="dialog" class="dialog" popover="manual">
      <button class="close icon" @click="close"><CloseIcon /></button>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  import CloseIcon from '../assets/icons/close.svg'
  
  export default {
    components: {    
      CloseIcon
    },
    methods: {
      open() {
        this.$refs.dialog.showPopover();
      },
      close() {
        this.$refs.dialog.hidePopover();
      }
    }
  }
  </script>
  
  <style scoped>
    .dialog::backdrop {
      background-color: rgba(43, 32, 28, 0.66);
    }
    .dialog {
      background-color: var(--color-background);
      color: var(--color-text);
      min-width: 300px;
      padding: 10px 15px 15px 15px;
      border: 2px solid var(--color-dark-bg);
      border-radius: 4px;
    }
    
    .close {
      background-color: var(--color-background);
      color: var(--color-text);
      position: absolute;
      top: 0;
      right: 0;
    }
  </style>
  