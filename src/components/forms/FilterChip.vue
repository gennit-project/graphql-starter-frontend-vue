<script>
import { defineComponent } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";

export default defineComponent({
  components: {
    ChevronDownIcon
  },
  setup() {},
  props: {
    label: {
      type: String,
      default: "No label",
    },
    highlighted: {
      type: Boolean,
      default: false
    }
  },
});
</script>

<template>
  <div class="inline-block">
    <VDropdown>
      <button
        :class="[highlighted ? 'ring-1 ring-blue-500 border-blue-500' : '']"
        class="
          inline-flex
          items-center
          mt-1
          mb-2
          max-height-4
          px-2.5
          py-1.5
          border
          text-xs
          font-medium
          rounded
          text-gray-700
          bg-white
          hover:bg-gray-200
          focus:ring-1 focus:ring-blue-500 focus:border-blue-500
        "
      >
        <slot name="icon"></slot>

        {{ label }}
        <ChevronDownIcon class="-mr-1 ml-1 h-4 w-4" aria-hidden="true" />
      </button>
      <template #popper >
        <slot name="content"></slot>
      </template>
    </VDropdown>
  </div>
</template>