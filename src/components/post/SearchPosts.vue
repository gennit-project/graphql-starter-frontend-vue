<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { gql } from "@apollo/client/core";
import { useQuery } from "@vue/apollo-composable";
import { GET_TAGS } from "@/graphQLData/tag/queries";
import PostList from "./PostList.vue";
import TagPicker from "@/components/forms/TagPicker.vue";
import TagIcon from "../icons/TagIcon.vue";
import ErrorBanner from "@/components/forms/ErrorBanner.vue";
import CreateButton from "@/components/buttons/CreateButton.vue";
import FilterChip from "../forms/FilterChip.vue";

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
    FilterChip,
    PostList,
    TagIcon,
    TagPicker,
  },
  setup() {
    const selectedTags: Ref<Array<string>> = ref([]);
    const searchInput: Ref<string> = ref("");
    let textFilter = computed(() => {
      if (!searchInput.value) {
        return "";
      }

      // Match a case-insensitive regex for the search term
      return `,
      { 
        OR: [
			    {
		        title_MATCHES: "(?i).*${searchInput.value}.*"
			    },{
			    	description_MATCHES: "(?i).*${searchInput.value}.*"
			    }
		    ]
      },
      `;
    });
    let tagFilter = computed(() => {
      if (selectedTags.value.length > 0) {
        let matchTags = selectedTags.value.reduce((prev, curr) => {
          return prev + `{ text_MATCHES: "(?i)${curr}" },`;
        }, "");
        return `{
          TagsConnection: {
            node: {
              OR: [${matchTags}]
            }
          }
        }`;
      }
      return "";
    });

    let postFilterString = computed(() => {
      return `(
                options: {
                  sort: {
                    createdAt: ASC
                  }
                }
                where: {
                  AND: [
                    
                    ${textFilter.value}
                    ${tagFilter.value}
                  ]
                }
              ) `;
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

    let postQueryString = computed(() => {
      let str = `
        query {
          posts ${postFilterString.value}{
            id
            title
            description
            Poster {
              username
            }
            Tags {
              text
            }
            CommentSections {
              id
              CommentsAggregate {
                count
              }
              OriginalPost {
                __typename
                ... on Post {
                  id
                  title
                }
              }
            }
          }
        }`;
      return str;
    });

    // Turn the query string into an actual GraphQL
    // query. Any GraphQL syntax errors will be thrown here.
    let postQuery = computed(() => {
      try {
        return gql`
          ${postQueryString.value}
        `;
      } catch (err) {
        throw new Error(`Invalid query string: ${postQueryString.value}`);
      }
    });

    const {
      error: postError,
      result: postResult,
      loading: postLoading,
      refetch: refetchPosts,
      fetchMore,
    } = useQuery(postQuery, { first: 20, offset: 0 });

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
      postQuery,
      postQueryString,
      postResult,
      postFilterString,
      reachedEndOfResults,
      refetchPosts,
      router,
      selectedTags,
      setSelectedTags,
      tagLabel,
      tagOptionLabels,
    };
  },
  methods: {
    updateSearchResult(input: string) {
      this.setSearchInput(input);
    },
    filterByTag(tag: string) {
      this.setSelectedTags([tag]);
    },
  },
});
</script>
<template>
  <div class="container">
    <div v-if="postLoading">Loading...</div>
    <ErrorBanner class="mt-2" v-else-if="postError" :text="postError.message" />
    <div v-else class="inline-flex space-x-2">
      <div class="items-center align-middle mt-1">
        <FilterChip
          :label="tagLabel"
          :highlighted="tagLabel !== defaultFilterLabels.tags"
        >
          <template v-slot:icon>
            <TagIcon />
          </template>
          <template v-slot:content>
            <TagPicker
              :tag-options="tagOptionLabels"
              :selected-tags="selectedTags"
              @setSelectedTags="setSelectedTags"
            />
          </template>
        </FilterChip>
      </div>
      <div class="items-center align-middle mt-1">
        <CreateButton :to="createPostPath" :label="'Create Post'" />
      </div>
    </div>
    <PostList
      id="listView"
      v-if="postResult && postResult.posts"
      class="relative text-lg"
      :posts="postResult.posts"
      :selected-tags="selectedTags"
      @filterByTag="filterByTag"
    />
    <div
      v-if="postResult && postResult.posts"
      class="grid justify-items-stretch"
    >
      <button class="justify-self-center" @click="loadMore">
        {{ reachedEndOfResults ? "There are no more results." : "Load more" }}
      </button>
    </div>
  </div>
</template>

<style>
.gray {
  color: gray;
}
</style>
