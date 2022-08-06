
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  setup() {},
});
</script>

<template>
  <button
    class="
      mt-2
      inline-flex
      bg-white
      py-2
      px-4
      border border-gray-300
      rounded-md
      shadow-sm
      text-sm
      font-medium
      text-gray-700
      hover:bg-gray-50
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    "
  >
    {{ text }}
</button>
</template>