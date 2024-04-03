<template>
  <div class="text-ending-with-link">
    <div>{{ textWithoutLink }}</div>
    <Link
      v-if="link"
      :x="link.x"
      :y="link.y"
      @click="Click"
      @mouseenter="MouseEnter"
      @mouseleave="MouseLeave" />
  </div>
</template>

<script>
import Link from './Link.vue';

export default {
  components: {
    Link,
  },
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  emits: ['click', 'mouseenter', 'mouseleave'],
  computed: {
    coord() {
      return `${this.x},${this.y}`;
    },
    regexMatch() {
      return /(\d\d?\d?),(\d\d?\d?)/.exec(this.text);
    },
    textWithoutLink() {
      if (this.regexMatch) return this.text.substring(0, this.regexMatch.index);
      return this.text;
    },
    link() {
      if (this.regexMatch) {
        const x = parseInt(this.regexMatch[1]);
        const y = parseInt(this.regexMatch[2]);
        return {
          x,
          y,
        };
      }
      return null;
    },
  },
  methods: {
    Click() {
      this.$emit('click', this.link);
    },
    MouseEnter() {
      this.$emit('mouseenter', this.link);
    },
    MouseLeave() {
      this.$emit('mouseleave', this.link);
    },
  },
};
</script>

<style scoped>
.text-ending-with-link {
  display: flex;
  gap: 0.2em;
  flex-wrap: wrap;

  button.link {
    transform: none;
  }
}
</style>
