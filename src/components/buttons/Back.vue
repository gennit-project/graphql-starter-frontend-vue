<script setup lang="ts">

</script>

<template>
  <button
    @click="$router.go(-1)"
    type="button"
    class="
      inline-flex
      items-center
      mt-2
      py-1.5
      text-xs
      font-medium
      rounded
      text-gray-500
      bg-white
      hover:text-gray-800
      focus:outline-none
      focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    "
  >
    ← Back
  </button>
</template>