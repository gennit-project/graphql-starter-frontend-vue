<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { GET_POST } from "@/graphQLData/post/queries";

import {
  useQuery,
  useMutation,
  provideApolloClient,
} from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";
import { useRoute, useRouter } from "vue-router";
import { TagData } from "@/types/tagTypes";
import { apolloClient } from "@/main";

import { PostData } from "@/types/postTypes";
import { DateTime } from "luxon";
import CreateEditFormFields from "./CreateEditFormFields.vue";

export default defineComponent({
  name: "EditPost",
  components: {
    CreateEditFormFields,
  },
  apollo: {},
  setup() {
    provideApolloClient(apolloClient);
    const route = useRoute();
    const router = useRouter();
    const postId: string | string[] = route.params.postId;
    const username = "cluse";

    const {
      result,
      loading: postLoading,
      error: postError,
    } = useQuery(GET_POST, {
      id: postId,
    });

    const postData = computed(() => {
      if (!result.value || !result.value.posts || !result.value.posts[0]) {
        return null;
      }
      return result.value.posts[0];
    });

    const existingTags = computed(() => {
      if (!postData.value || !postData.value.Tags) {
        return [];
      }
      return postData.value.Tags.map((tag: TagData) => {
        return tag.text;
      });
    });

    console.log("existing ", {
      existingTags: existingTags.value,
    });

    // The form fields in the edit form are initialized
    // with the existing values.
    const title = ref(postData.value.title);
    const description = ref(postData.value.description);
    const selectedTags = ref(existingTags.value);
    const startTime = ref(postData.value?.startTime);
    const endTime = ref(postData.value?.endTime);

    const startTimePieces = computed(() => {
      const startTimeObj = DateTime.fromISO(startTime.value);
      const { year, month, day, weekday, hour } = startTimeObj;

      return {
        startTimeYear: year.toString(),
        startTimeMonth: month.toString(),
        startTimeDayOfMonth: day.toString(),
        startTimeDayOfWeek: weekday.toString(),
        startTimeHourOfDay: hour,
      };
    });

    const updatePostInput = computed(() => {
      const tagConnections = selectedTags.value.map((tag: string) => {
        return {
          onCreate: {
            node: {
              text: tag,
            },
          },
          where: {
            node: {
              text: tag,
            },
          },
        };
      });

      const tagDisconnections = existingTags.value
        .filter((tag: string) => {
          return !selectedTags.value.includes(tag);
        })
        .map((tag: string) => {
          return {
            where: {
              node: {
                text: tag,
              },
            },
          };
        });

      let input = {
        /*
          Using null values by default for required fields such as the
          title prevents the empty string from being created on the back
          end if the title is not provided.
        */
        title: title.value || null,
        description: description.value || null,
        startTime: startTime.value || null,
        startTimeYear: startTimePieces.value.startTimeYear || null,
        startTimeMonth: startTimePieces.value.startTimeMonth || null,
        startTimeDayOfMonth: startTimePieces.value.startTimeDayOfMonth || null,
        startTimeDayOfWeek: startTimePieces.value.startTimeDayOfWeek || null,
        startTimeHourOfDay: startTimePieces.value.startTimeHourOfDay || null,
        endTime: endTime.value || null,
        canceled: false,
        Tags: {
          connectOrCreate: tagConnections,
          disconnect: tagDisconnections,
        },
      };

      const inputKeys = Object.keys(input);

      // Don't send empty values in call to update post
      for (let i = 0; i < inputKeys.length; i++) {
        const key = inputKeys[i];
        // eslint-disable-next-line
        let data = input[key];

        if (data === null) {
          // eslint-disable-next-line
          delete input[key];
        }
      }

      return input;
    }); // End of updatePostInput

    const UPDATE_POST = gql`
      mutation ($updatePostInput: PostUpdateInput, $eventWhere: PostWhere) {
        updatePosts(update: $updatePostInput, where: $eventWhere) {
          posts {
            id
            title
            description
            Poster {
              username
            }
            Tags {
              text
            }
          }
        }
      }
    `;

    const {
      mutate: updatePost,
      error: updatePostError,
      onDone,
    } = useMutation(UPDATE_POST, () => {
      return {
        errorPolicy: "all",
        variables: {
          updatePostInput: updatePostInput.value,
          postWhere: {
            id: postData.value.id,
          },
        },
        update: (cache: any, result: any) => {
          const newPost: PostData = result.data?.updatePosts?.posts[0];

          cache.modify({
            fields: {
              posts(existingPostRefs = [], fieldInfo: any) {
                const readField = fieldInfo.readField;
                const newPostRef = cache.writeFragment({
                  data: newPost,
                  fragment: gql`
                    fragment NewPost on Posts {
                      id
                    }
                  `,
                });

                // Quick safety check - if the new post is already
                // present in the cache, we don't need to add it again.
                if (
                  existingPostRefs.some(
                    (ref: any) => readField("id", ref) === newPostRef.id
                  )
                ) {
                  return existingPostRefs;
                }
                return [newPostRef, ...existingPostRefs];
              },
            },
          });
        },
      };
    });

    onDone((response: any) => {

      const newPostId = response.data.updatePosts.posts[0].id;
      router.push({
        name: "PostDetail",
        params: {
          postId: newPostId,
        },
      });
    });

    return {
      postData,
      postError,
      postLoading,
      description,
      endTime,
      router,
      selectedTags,
      startTime,
      startTimePieces,
      title,
      touched: false,
      updatePost,
      updatePostError,
      updatePostInput,
      username,
    };
  },

  methods: {
    async submit() {
      this.updatePost();
    },
    updateTitle(updated: String) {
      this.title = updated;
    },
    updateDescription(updated: string) {
      this.description = updated;
    },
    setSelectedTags(tag: Array<string>) {
      console.log('set selected tags ', tag)
      this.selectedTags = tag;
    },
    cancel() {
        this.router.push({
          name: "SearchPosts",
        });
    },
  },
});
</script>
<template>
  <div>
    <div v-if="postLoading">Loading...</div>
    <div v-else-if="postError">
      <div v-for="(error, i) of postError?.graphQLErrors" :key="i">
        {{ error.message }}
      </div>
    </div>
    <CreateEditFormFields
      v-else
      :create-post-error="null"
      :description="description"
      :edit-mode="true"
      :post-data="postData"
      :post-error="postError"
      :post-loading="postLoading"
      :selected-tags="selectedTags"
      @cancel="cancel"
      @setSelectedTags="setSelectedTags"
      @submit="submit"
      @updateDescription="updateDescription"
      @updateTitle="updateTitle"
    />
  </div>
</template>