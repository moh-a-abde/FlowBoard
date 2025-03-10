<template>
  <button 
    @click="$emit('delete')" 
    class="bg-gray-700 dark:bg-gray-900 text-white dark:text-white rounded-full p-1.5 hover:bg-gray-800 dark:hover:bg-gray-950 transition-colors shadow-sm flex items-center justify-center"
    :aria-label="ariaLabel"
  >
    <IconManager name="x-close" :size="size" className="stroke-current stroke-2" />
  </button>
</template>

<script setup>
import IconManager from './IconManager.vue';

defineProps({
  size: {
    type: [Number, String],
    default: 14
  },
  ariaLabel: {
    type: String,
    default: 'Delete tag'
  }
});

defineEmits(['delete']);
</script> 