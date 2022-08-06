<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
});
</script>
<template>
  <td class="px-3 py-4 text-left whitespace-nowrap text-sm text-gray-500">
    <div class="flex items-center h-5">
      <slot />
    </div>
  </td>
</template>