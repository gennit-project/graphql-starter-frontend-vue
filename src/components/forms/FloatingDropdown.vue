<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
    setup() {
        
    },
})
</script>

<template>
<VDropdown
  :distance="6"
>
  <!-- This will be the popover reference (for the events and position) -->
  <button @click.prevent class="w-full">
    <slot name="button"/>
  </button>

  <!-- This will be the content of the popover -->
  <template #popper>
    <slot name="content"/>
  </template>
</VDropdown>
</template>

