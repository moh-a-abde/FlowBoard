<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      size ? `btn-${size}` : '',
      iconOnly ? 'btn-icon' : '',
      block ? 'w-full' : '',
      disabled ? 'disabled' : '',
      loading ? 'opacity-70 cursor-wait' : '',
      className
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="$emit('click', $event)"
  >
    <IconManager
      v-if="loading"
      name="spinner"
      size="16"
      className="animate-spin mr-2"
      title="Loading"
    />
    <IconManager
      v-if="icon && !loading"
      :name="icon"
      :size="iconSize || (size === 'sm' ? '14' : size === 'lg' ? '20' : '16')"
      :className="iconClass"
      :title="iconTitle"
    />
    <span v-if="!iconOnly">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import IconManager from './IconManager.vue';

defineEmits(['click']);

defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'error', 'warning'].includes(value)
  },
  size: {
    type: String,
    default: '',
    validator: (value) => ['', 'sm', 'lg'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  iconOnly: {
    type: Boolean,
    default: false
  },
  iconSize: {
    type: String,
    default: ''
  },
  iconClass: {
    type: String,
    default: 'mr-2'
  },
  iconTitle: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
/* Button styles are defined in the global style.css file */
</style> 