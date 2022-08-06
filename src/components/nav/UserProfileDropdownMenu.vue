<script>
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
  props: {
      showUserProfileDropdown: {
          type: Boolean,
          default: false
      }
  }
});
</script>
<template>
  <!--
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
    From: "transform opacity-0 scale-95"
    To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
    From: "transform opacity-100 scale-100"
    To: "transform opacity-0 scale-95"
-->
  <div
    v-if="showUserProfileDropdown"
    class="
                origin-top-right
                absolute
                right-0
                mt-2
                w-48
                rounded-md
                shadow-lg
                py-1
                bg-white
                ring-1 ring-black ring-opacity-5
                focus:outline-none
                z-10
              "
    role="menu"
    aria-orientation="vertical"
    aria-labelledby="user-menu-button"
    tabindex="-1"
  >
    <router-link
      to="/u/1"
      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      role="menuitem"
      tabindex="-1"
      id="user-menu-item-0"
      >Your Profile</router-link
    >
    <router-link
      to="settings"
      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      role="menuitem"
      tabindex="-1"
      id="user-menu-item-1"
      >Settings</router-link
    >
    <router-link
      to="signout"
      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      role="menuitem"
      tabindex="-1"
      id="user-menu-item-2"
      >Sign out</router-link
    >
  </div>
</template>
