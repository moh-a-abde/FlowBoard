<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="size" 
    :height="size" 
    :viewBox="viewBox" 
    :fill="fill" 
    :stroke="stroke" 
    :stroke-width="strokeWidth"
    :stroke-linecap="strokeLinecap"
    :stroke-linejoin="strokeLinejoin"
    :class="computedClass"
    :aria-hidden="!title"
    role="img"
  >
    <title v-if="title">{{ title }}</title>
    <slot></slot>
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  size: {
    type: [Number, String],
    default: 24,
  },
  viewBox: {
    type: String,
    default: '0 0 24 24',
  },
  fill: {
    type: String,
    default: 'none',
  },
  stroke: {
    type: String,
    default: 'currentColor',
  },
  strokeWidth: {
    type: [Number, String],
    default: 2,
  },
  strokeLinecap: {
    type: String,
    default: 'round',
  },
  strokeLinejoin: {
    type: String,
    default: 'round',
  },
  class: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
});

const computedClass = computed(() => {
  return `icon icon-${props.name} ${props.class}`;
});
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style> 