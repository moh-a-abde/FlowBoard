<template>
  <BaseIcon
    :name="name"
    :size="size"
    :class="className"
    :title="title"
    :fill="fill"
    :stroke="stroke"
    :stroke-width="strokeWidth"
  >
    <component :is="currentIcon" />
  </BaseIcon>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import BaseIcon from './BaseIcon.vue';

// Define all icons with lazy loading
const iconComponents = {
  // Flow/App logo icons
  'flow-wave': defineAsyncComponent(() => import('../assets/icons/FlowWave.vue')),
  'flow-logo': defineAsyncComponent(() => import('../assets/icons/FlowLogo.vue')),

  // UI/Navigation icons
  'sun': defineAsyncComponent(() => import('../assets/icons/Sun.vue')),
  'moon': defineAsyncComponent(() => import('../assets/icons/Moon.vue')),
  'task-list': defineAsyncComponent(() => import('../assets/icons/TaskList.vue')),
  'logout': defineAsyncComponent(() => import('../assets/icons/Logout.vue')),
  'x-close': defineAsyncComponent(() => import('../assets/icons/XClose.vue')),
  'plus': defineAsyncComponent(() => import('../assets/icons/Plus.vue')),
  'search': defineAsyncComponent(() => import('../assets/icons/Search.vue')),
  'filter': defineAsyncComponent(() => import('../assets/icons/Filter.vue')),
  'time': defineAsyncComponent(() => import('../assets/icons/Time.vue')),
  'check': defineAsyncComponent(() => import('../assets/icons/Check.vue')),
  'list': defineAsyncComponent(() => import('../assets/icons/List.vue')),
  'clock': defineAsyncComponent(() => import('../assets/icons/Clock.vue')),
  'menu': defineAsyncComponent(() => import('../assets/icons/Menu.vue')),
  'menu-fold': defineAsyncComponent(() => import('../assets/icons/MenuFold.vue')),
  'todo': defineAsyncComponent(() => import('../assets/icons/Todo.vue')),
  'todo-icon': defineAsyncComponent(() => import('../assets/icons/TodoIcon.vue')),
  'todo-rounded': defineAsyncComponent(() => import('../assets/icons/TodoRounded.vue')),
  'in-progress': defineAsyncComponent(() => import('../assets/icons/InProgress.vue')),
  'stats': defineAsyncComponent(() => import('../assets/icons/Stats.vue')),

  // Status icons
  'warning': defineAsyncComponent(() => import('../assets/icons/Warning.vue')),
  'info': defineAsyncComponent(() => import('../assets/icons/Info.vue')),
  'error': defineAsyncComponent(() => import('../assets/icons/Error.vue')),
  'success': defineAsyncComponent(() => import('../assets/icons/Success.vue')),

  // Activity icons
  'status-change': defineAsyncComponent(() => import('../assets/icons/StatusChange.vue')),
  'comment': defineAsyncComponent(() => import('../assets/icons/Comment.vue')),
  'edit': defineAsyncComponent(() => import('../assets/icons/Edit.vue')),
  'create': defineAsyncComponent(() => import('../assets/icons/Create.vue')),

  // Feature icons
  'message': defineAsyncComponent(() => import('../assets/icons/Message.vue')),
  'history': defineAsyncComponent(() => import('../assets/icons/History.vue')),
  'dashboard': defineAsyncComponent(() => import('../assets/icons/Dashboard.vue')),
  'shield': defineAsyncComponent(() => import('../assets/icons/Shield.vue')),
  'drag': defineAsyncComponent(() => import('../assets/icons/Drag.vue')),
  'priority': defineAsyncComponent(() => import('../assets/icons/Priority.vue')),
  
  // Form icons
  'email': defineAsyncComponent(() => import('../assets/icons/Email.vue')),
  'user': defineAsyncComponent(() => import('../assets/icons/User.vue')),
  'lock': defineAsyncComponent(() => import('../assets/icons/Lock.vue')),
  'spinner': defineAsyncComponent(() => import('../assets/icons/Spinner.vue')),
};

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 24
  },
  className: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  fill: {
    type: String,
    default: 'none'
  },
  stroke: {
    type: String,
    default: 'currentColor'
  },
  strokeWidth: {
    type: [Number, String],
    default: 2
  }
});

const currentIcon = computed(() => {
  return iconComponents[props.name] || null;
});
</script> 