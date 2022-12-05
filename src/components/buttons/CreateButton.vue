<script lang="ts">
import { defineComponent } from "vue";
import { router } from "@/router";

export default defineComponent({
  props: {
    to: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup() {
    return { router };
  },
});
</script>
<template>
  <button
    @click="router.push(to)"
    class="
      mt-2
      inline-flex
      bg-white
      py-2
      px-4
      rounded-md
      shadow-sm
      text-sm
      font-medium
      text-blue-700
      bg-blue-100
      hover:bg-blue-200
      focus:outline-none
      focus:ring-offset-2
      focus:ring-offset-gray-100
      focus:ring-blue-500
    "
  >
    {{ label }}
  </button>
</template>
