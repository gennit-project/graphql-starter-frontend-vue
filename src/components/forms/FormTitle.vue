<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    setup(){}
})
</script>
<template>
  <h1 class="pt-2 text-xl font-medium text-gray-900">
    <slot />
  </h1>
</template>