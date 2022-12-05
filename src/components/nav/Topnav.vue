<script lang="ts">
import { defineComponent } from "vue";
import TopNavLink from "@/components/nav/TopNavLink.vue";
import MobileMenuButton from "@/components/nav/MobileMenuButton.vue";
import DiscussionIcon from "@/components/icons/DiscussionIcon.vue";

export default defineComponent({
  name: "TopNav",
  components: {
    DiscussionIcon,
    TopNavLink,
    MobileMenuButton,
  },
  data() {
    return {
      showUserProfileDropdown: false,
      showMobileDropdown: false,
    };
  },
  methods: {
    toggleUserProfileDropdown() {
      this.showUserProfileDropdown = !this.showUserProfileDropdown;
    },
  },
});
</script>

<template>
  <div class="max-w-7xl px-2 sm:px-4 lg:px-8">
    <div class="relative flex items-center justify-between h-14">
      <div class="flex items-center px-2 lg:px-0">
        <div class="px-2 text-white">GraphQL + Vue Starter Frontend</div>
        
        <div class="hidden lg:block lg:ml-6">
          <div class="flex space-x-4 text-gray-300">
            <TopNavLink :to="'/posts'" :label="'Posts'">
              <DiscussionIcon />
            </TopNavLink>
          </div>
        </div>
      </div>
      <div class="flex lg:hidden">
        <MobileMenuButton @click="$emit('toggleMobileDropdown')" />
      </div>
    </div>
  </div>
</template>
