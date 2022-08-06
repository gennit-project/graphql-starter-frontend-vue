<script lang="ts">
import { defineComponent } from "vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";

export default defineComponent({
  setup() {},
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    ChevronDownIcon,
  },
});
</script>
<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="
          pl-3
          pr-2
          inline-flex
          text-xs
          leading-5
          font-semibold
          rounded-full
          bg-green-100
          text-green-800
          cursor-pointer
        "
      >
        Future
        <ChevronDownIcon class="-mr-1 h-5 w-4" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition>
      <MenuItems
        class="
          origin-top-right
          absolute
          left-0
          mt-2
          w-56
          rounded-md
          shadow-lg
          bg-white
          ring-1 ring-black ring-opacity-5
          divide-y divide-gray-100
          focus:outline-none
          z-10
        "
      >
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
              >Future</a
            >
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
              >Past</a
            >
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
