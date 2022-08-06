
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
  props: {
    sectionTitle: {
      type: String,
      default: "",
    },
  },
});
</script>

<template>
  <div
    class="
      sm:grid
      sm:grid-cols-4
      sm:gap-4
      sm:items-start
    "
  >
    <label
      v-if="sectionTitle"
      for="title"
      class="
        block
        text-sm
        font-medium
        text-gray-700
        sm:mt-px sm:pt-2
        align-right
      "
    >
      {{ sectionTitle }}
    </label>
    <div
      v-else
      for="title"
      class="
        text-sm
        font-medium
        text-gray-700
        sm:mt-px sm:pt-2
        align-right
      "
    >
      <slot name="icon" ></slot>
    </div>
    <div class="sm:col-span-3">
       <slot name="content"></slot>
    </div>
  </div>
</template>
<style scoped>
.align-right {
  display: inline-block;
  text-align: right;
}
</style>