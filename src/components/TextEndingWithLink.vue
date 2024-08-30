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
<script setup>
import { computed } from 'vue';
import Link from './Link.vue';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['click', 'mouseenter', 'mouseleave']);

const regexMatch = computed(() => /(\d\d?\d?),(\d\d?\d?)/.exec(props.text));

const textWithoutLink = computed(() => {
  if (regexMatch.value) return props.text.substring(0, regexMatch.value.index);
  return props.text;
});

const link = computed(() => {
  if (regexMatch.value) {
    const x = parseInt(regexMatch.value[1]);
    const y = parseInt(regexMatch.value[2]);
    return { x, y };
  }
  return null;
});

const Click = () => {
  emit('click', link.value);
};

const MouseEnter = () => {
  emit('mouseenter', link.value);
};

const MouseLeave = () => {
  emit('mouseleave', link.value);
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
