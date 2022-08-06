<script lang="ts">
import { defineComponent } from "vue";
import TopNavLink from "@/components/nav/TopNavLink.vue";
import MobileMenuButton from "@/components/nav/MobileMenuButton.vue";
// import NotificationButton from '@/components/nav/NotificationButton.vue'
// import UserProfileDropdownMenu from '@/components/nav/UserProfileDropdownMenu.vue'
// import UserProfileButton from '@/components/nav/UserProfileButton.vue'
import DiscussionIcon from "@/components/icons/DiscussionIcon.vue";

export default defineComponent({
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
        <!-- <SiteLogo/> -->
        <div class="px-2 text-white">GraphQL + Vue Starter Frontend</div>
        
        <div class="hidden lg:block lg:ml-6">
          <div class="flex space-x-4 text-gray-300">
            <TopNavLink :to="'/posts'" :label="'Posts'">
              <DiscussionIcon />
            </TopNavLink>
          </div>
        </div>
      </div>
      <!-- <TopNavSearchBar/> -->
      <div class="flex lg:hidden">
        <MobileMenuButton @click="$emit('toggleMobileDropdown')" />
      </div>
      <!-- <div class="hidden lg:block lg:ml-4">
        <div class="flex items-center">
          <NotificationButton/>

          <div class="ml-4 relative flex-shrink-0">
            <div @click="toggleUserProfileDropdown">
              <UserProfileButton/>
            </div>

            <UserProfileDropdownMenu
              :show-user-profile-dropdown="showUserProfileDropdown"
            />
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
