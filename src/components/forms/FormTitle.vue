<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    setup(){}
})
</script>
<template>
  <h1 class="text-lg leading-6 font-medium text-gray-900">
    <slot />
  </h1>
</template>