<script lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";

const solutions = [
  {
    name: "Blog",
    description: "Learn about tips, product updates and company culture.",
    href: "#",
  },
  {
    name: "Help Center",
    description:
      "Get all of your questions answered in our forums of contact support.",
    href: "#",
  },
];

export default {
  components: {
    Popover,
    PopoverButton,
    PopoverPanel,
    ChevronDownIcon,
  },
  setup() {
    return {
      solutions,
    };
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
};
</script>
<template>
  <Popover class="relative inline-flex" v-slot="{ open }">
    <PopoverButton
      :class="[
        open ? 'text-gray-900' : 'text-gray-500',
        'mb-1 inline-flex justify-center w-full rounded-md px-3 py-2 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
      ]"
    >
      <span>{{ name }}</span>
      <ChevronDownIcon class="-mr-1 ml-2 h-4 w-4" aria-hidden="true" />
    </PopoverButton>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <PopoverPanel
        class="absolute mt-12 z-20 transform mt-3 w-screen max-w-md sm:px-0"
      >
        <div
          class="
            rounded-lg
            shadow-lg
            ring-1 ring-black ring-opacity-5
            overflow-hidden
          "
        >
          <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
            <a
              v-for="item in solutions"
              :key="item.name"
              :href="item.href"
              class="
                -m-3
                p-3
                block
                rounded-md
                hover:bg-gray-50
                transition
                ease-in-out
                duration-150
              "
            >
              <p class="text-base font-medium text-gray-900">
                {{ item.name }}
              </p>
              <p class="mt-1 text-xs text-gray-500">
                {{ item.description }}
              </p>
            </a>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>