<script lang="ts">
import { defineComponent, ref } from "vue";

interface Ref<T> {
  value: T;
}

export default defineComponent({
  setup() {
    const input: Ref<string> = ref('');
    return { input };
  },
  props: {
    searchPlaceholder: {
      type: String,
      default: "",
    },
  },
  methods: {
    // removeQuotationMarks(input: String) {
    //   // Prevent errors when quotation marks are added
    //   // to GraphQL query
    //   return input
    //     .split("'")
    //     .join("")
    //     .split('"')
    //     .join("");
    // },
    updateSearchInput(e: any) {
      this.$emit(
        "updateSearchInput", e.target.value
        // this.removeQuotationMarks(e.target.value)
      );
    },
  },
});
</script>
<template>
  <div class="max-w-lg w-full lg:max-w-xs">
    <label for="search" class="sr-only">Search</label>
    <div class="relative">
      <div
        class="
          absolute
          inset-y-0
          left-0
          pl-3
          flex
          items-center
          pointer-events-none
        "
      >
        <!-- Heroicon name: solid/search -->
        <svg
          class="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <input
        v-model="input"
        id="search"
        name="search"
        class="
          pl-10
          pr-3
          py-2.5
          border border-gray-300
          rounded-md
          leading-5
          bg-white
          placeholder-gray-500
          focus:outline-none
          focus:placeholder-gray-400
          focus:ring-1
          focus:ring-blue-500
          focus:border-blue-500

          flex-1 block min-w-0 pl-3 rounded sm:text-sm
        "
        :placeholder="searchPlaceholder"
        @keyup="updateSearchInput($event)"
        type="text"
      />
    </div>
  </div>
</template>
