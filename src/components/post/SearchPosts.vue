<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { gql } from "@apollo/client/core";
import { useQuery } from "@vue/apollo-composable";
import { GET_TAGS } from "@/graphQLData/tag/queries";
import PostList from "./PostList.vue";
import TagInput from "@/components/forms/TagInput.vue";
import ErrorBanner from "@/components/forms/ErrorBanner.vue";
import CreateButton from "@/components/buttons/CreateButton.vue";
import SearchBar from "../forms/SearchBar.vue";

import { getTagLabel } from "@/components/forms/utils";
import { router } from "@/router";
// import { PostData } from "@/types/postTypes";
import { TagData } from "@/types/tagTypes.d";

interface Ref<T> {
  value: T;
}

export default defineComponent({
  name: "SearchPosts",
  components: {
    CreateButton,
    ErrorBanner,
    PostList,
    SearchBar,
    TagInput,
  },
  setup() {
    const selectedTags: Ref<Array<string>> = ref([]);
    const searchInput: Ref<string> = ref("");

    const postWhere = computed(() => {
      return {
        Tags: {
          OR: selectedTags.value.map((tag: string) => {
            return { text: tag };
          }),
        },
        OR: [
          {
            title_CONTAINS: searchInput.value,
          },
          {
            description_CONTAINS: searchInput.value,
          },
        ],
      };
    });

    const updateRouterQueryParams = () => {
      router.push({
        path: "/posts",
        query: {
          search: searchInput.value,
          tag: selectedTags.value,
        },
      });
    };

    const setSelectedTags = (tag: Array<string>) => {
      selectedTags.value = tag;
      updateRouterQueryParams();
    };

    let GET_POSTS = gql`
        query getPosts(
          $where: PostWhere
          $resultsOrder: [PostSort]
          $offset: Int
          $limit: Int
        ) {
          postsCount(where: $where)
          posts (
            where: $where
            options: {
              sort: $resultsOrder,
              offset: $offset,
              limit: $limit
            }
          ){
            id
            title
            description
            Poster {
              username
            }
            Tags {
              text
            }
            CommentsAggregate {
              count
            }
          }
        }`

    const {
      error: postError,
      result: postResult,
      loading: postLoading,
      refetch: refetchPosts,
      fetchMore,
    } = useQuery(GET_POSTS, { 
      where: postWhere,
      limit: 25, 
      offset: 0,
      resultsOrder: {
        createdAt: "DESC"
      }
    });

    const reachedEndOfResults = ref(false);

    const loadMore = () => {
      fetchMore({
        variables: {
          offset: postResult.value.posts.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (fetchMoreResult.posts.length === 0) {
            reachedEndOfResults.value = true;
            return prev;
          }
          return {
            ...prev,
            posts: [...prev.posts, ...fetchMoreResult.posts],
          };
        },
      });
    };

    const { result: tagResult } = useQuery(GET_TAGS);

    const tagOptionLabels = computed(() => {
      if (tagResult.value) {
        return tagResult.value.tags.map((tag: TagData) => tag.text);
      }
      return [];
    });

    const defaultFilterLabels = {
      tags: "Tags",
    };

    const tagLabel = computed(() => {
      return getTagLabel(selectedTags.value);
    });

    const createPostPath = "/posts/create";

    return {
      createPostPath,
      defaultFilterLabels,
      loadMore,
      placeData: null,
      postError,
      postLoading,
      postResult,
      reachedEndOfResults,
      refetchPosts,
      router,
      searchInput,
      selectedTags,
      setSelectedTags,
      tagLabel,
      tagOptionLabels,
    };
  },
  methods: {
    updateSearchResult(input: string) {
      this.searchInput = input
    },
    filterByTag(tag: string) {
      this.setSelectedTags([tag]);
    },
  },
});
</script>
<template>
  <div class="container">
    <div>
      <div class="inline-flex space-x-2">
        <div class="items-center inline-flex mt-2 space-x-2">
          <SearchBar
            :search-placeholder="'Search posts'"
            @updateSearchInput="updateSearchResult"
          />
          <TagInput
            class="wide"
            :tag-options="tagOptionLabels"
            :selected-tags="selectedTags.value"
            @setSelectedTags="setSelectedTags"
          />
          <CreateButton :to="createPostPath" :label="'Create Post'" />
        </div>
      </div>
      <div v-if="postLoading">Loading...</div>
      <ErrorBanner
        class="mt-2"
        v-else-if="postError"
        :text="postError.message"
      />
      <PostList
        v-else
        id="listView"
        class="relative text-lg"
        :search-input="searchInput.value"
        :posts="postResult.posts"
        :selected-tags="selectedTags.value"
        @filterByTag="filterByTag"
      />
      <div class="grid justify-items-stretch">
        <button class="justify-self-center" @click="loadMore">
          {{ reachedEndOfResults ? "There are no more results." : "Load more" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.gray {
  color: gray;
}
.wide {
  min-width: 30vw;
}
</style>
