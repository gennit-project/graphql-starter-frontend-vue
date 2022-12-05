<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
  props: {
    text: {
      type: String,
      required: true
    },
  },
});
</script>

<template>
  <p class="text-red-800 bg-red-100 p-2 rounded pl-4">{{text}}</p>
</template>