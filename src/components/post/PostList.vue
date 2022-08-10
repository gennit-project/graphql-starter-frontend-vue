<script lang="ts">
import { defineComponent, PropType } from "vue";
import PostListItem from "./PostListItem.vue";
import { useRouter } from "vue-router";
import { PostData } from "@/types/postTypes";

export default defineComponent({
  setup() {
    const router = useRouter();
  
    return {
      router,
    };
  },
  props: {
    highlightedPostId: {
      type: String,
      default: "",
    },
    posts: {
      type: Array as PropType<PostData[]>,
      default: () => {
        return [];
      },
    },
    selectedTags: {
      type: Array as PropType<String[]>,
      default: () => {
        return [];
      },
    },
    searchInput: {
      type: String,
      default: "",
    },
  },
  components: {
    PostListItem,
  },
  methods: {
    filterByTag(tag: string) {
      this.$emit("filterByTag", tag);
    },
    handleClickPostListItem(post: PostData) {

        return this.router.push({
          name: "PostDetail",
          params: {
            postId: post.id,
          }
        })
    },
  },
});
</script>

<template>
  <div :class="['bg-white', 'sm:rounded-md']">
    <p v-if="posts.length === 0">Could not find any posts.</p>
    <ul role="list" class="divide-y divide-gray-200">
      <PostListItem
        :ref="`#${post.id}`"
        v-for="post, i in posts"
        :key="i"
        :post="post"
        :selected-tags="selectedTags"
        :search-input="searchInput"
        :class="[
          post.id === highlightedPostId 
            ? 'bg-gray-100'
            : '',
        ]"
        @clickedPostListItem="handleClickPostListItem(post)"
        @filterByTag="filterByTag"
      />
    </ul>
  </div>
</template>