<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {},
});
</script>
<template>
  <button
    :disabled="disabled"
    :class="[
      disabled
        ? 'bg-gray-200 cursor-default text-gray-600'
        : 'text-white hover:bg-blue-700 bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    ]"
    class="
      ml-3
      inline-flex
      justify-center
      py-2
      px-4
      border border-transparent
      shadow-sm
      text-sm
      font-medium
      rounded-md
    "
  >
    Save
  </button>
</template>