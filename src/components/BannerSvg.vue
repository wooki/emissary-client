<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="viewBox"
      :height="height"
      :width="width">
      <Banner :decoration="decoration" :mask="mask" :x="x" :y="y" :flag="flag" @click="click" @mouseenter="mouseenter" @mouseleave="mouseleave">
        <slot />
      </Banner>
    </svg>
</template>

<script>
import Banner from '@/components/Banner.vue';

export default {
  props: {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    flag: {
      type: String,
      default: '01234',
      required: true,
    },
    scale: {
      type: Number,
      default: 1,
    },
    mask: {
      type: String,
      default: ""
    },
    decoration: {
      type: Boolean,
      default: true,
    }
  },
  components: {
    Banner
  },
  emits: ['click', 'mouseenter', 'mouseleave'],  
  computed: {
    viewBox() {
      if (this.mask == 'banner') {
        return "8 0 16 32";
      } else if (this.mask == 'agent') {
        return "4 4 24 24";
      } else if (this.mask == 'army') {
        return "4 2 24 30";
      } else if (this.mask == 'ship') {
        return "2 1 20 30";
      }
      return "0 0 32 32";
    },
    height() {
      if (this.mask == 'banner') {
        return 32;
      } else if (this.mask == 'agent') {
        return 24;
      } else if (this.mask == 'army') {
        return 30;
      } else if (this.mask == 'ship') {
        return 29;
      }
      return 32;
    },
    width() {
      if (this.mask == 'banner') {
        return 16;
      } else if (this.mask == 'agent') {
        return 24;
      } else if (this.mask == 'army') {
        return 24;
      } else if (this.mask == 'ship') {
        return 18;
      }
      return 32;
    }
  },
  methods: {
    click() {
      this.$emit('click', this.data);
    },
    mouseenter() {
      this.$emit('mouseenter', this.data);
    },
    mouseleave() {
      this.$emit('mouseleave', this.data);
    },
  },
};
</script>

<style scoped>

</style>
