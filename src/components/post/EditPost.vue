<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { GET_POST } from "@/graphQLData/post/queries";
import { UPDATE_POST } from "@/graphQLData/post/mutations";
import {
  useQuery,
  useMutation,
  provideApolloClient,
} from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";
import { useRoute, useRouter } from "vue-router";
import { TagData } from "@/types/tagTypes";
import { apolloClient } from "@/main";
import { PostData, CreateEditPostFormValues } from "@/types/postTypes";
import CreateEditPostFields from "./CreateEditPostFields.vue";

export default defineComponent({
  name: "EditPost",
  components: {
    CreateEditPostFields,
  },
  apollo: {},
  setup() {
    provideApolloClient(apolloClient);
    const route = useRoute();
    const router = useRouter();
    const postId: string | string[] = route.params.postId;

    const {
      result: getPostResult,
      onResult: onGetPostResult,
      error: getPostError,
      loading: getPostLoading,
    } = useQuery(GET_POST, { postId });

    const post = computed(() => {
      if (getPostError.value || getPostLoading.value) {
        return null;
      }
      return getPostResult.value.posts[0];
    });

    // Remember the existing tags so that if the user removes
    // one or more tags, we will know to manually disconnect
    // the nodes in the async call when the post is updated.
    const existingTags = computed(() => {
      if (getPostError.value || getPostLoading.value || !post.value.Tags) {
        return [];
      }
      return post.value.Tags.map((tag: TagData) => {
        return tag.text;
      });
    });

    const getDefaultFormValues = () => {
      // If the post data is already loaded, start with
      // the existing values. This will be used if you load the page,
      // navigate away and come back.
      if (post.value) {
        return {
          title: post.value.title,
          description: post.value.description,
          selectedTags: post.value.Tags.map((tag: TagData) => {
            return tag.text;
          }),
        };
      }
      // If the post data is loading, start with empty values. These
      // will be overwritten by onGetPostResult function when the post
      // data is loaded.
      return {
        title: "",
        description: "",
        selectedTags: [],
      };
    };

    const formValues = ref<CreateEditPostFormValues>(getDefaultFormValues());

    // Populate the form with existing data after it is loaded.
    onGetPostResult((value) => {
      const post = value.data.posts[0];

      formValues.value = {
        title: post.title,
        description: post.description,
        selectedTags: post.Tags.map((tag: TagData) => {
          return tag.text;
        }),
      };
    });

    const updatePostInput = computed(() => {
      const tagConnections = formValues.value.selectedTags.map(
        (tag: string) => {
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
        }
      );

      const tagDisconnections = existingTags.value
        .filter((tag: string) => {
          return !formValues.value.selectedTags.includes(tag);
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
        title: formValues.value.title || null,
        description: formValues.value.description || null,
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
            id: postId,
          },
        },
        update: (cache: any, result: any) => {
          const newPost: PostData = result.data?.updatePosts?.posts[0];
          const updatedTags = newPost.Tags
          cache.modify({
            fields: {
              tags(existingTagRefs = [], fieldInfo: any) {
                const readField = fieldInfo.readField;

                const tagRefsOnPost = updatedTags.map((tagData: TagData) => {
                  return cache.writeFragment({
                    data: tagData,
                    fragment: gql`
                      fragment NewTag on Tags {
                        text
                      }
                    `,
                  });
                })

                let newTagRefs = []

                for (let i = 0; i < tagRefsOnPost.length; i++) {
                  const newTagRef = tagRefsOnPost[i];
                  const alreadyExists = existingTagRefs.some(
                    (ref: any) => readField("text", ref) === readField("text", newTagRef)
                  )
                  if (!alreadyExists) {
                    newTagRefs.push(newTagRef)
                  }
                }

                return [...newTagRefs, ...existingTagRefs];
              }
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
      getPostError,
      getPostLoading,
      formValues,
      router,
      updatePost,
      updatePostError,
      updatePostInput,
    };
  },

  methods: {
    async submit() {
      this.updatePost();
    },
    updateFormValues(data: CreateEditPostFormValues) {
      // Update all form values at once because it makes cleaner
      // code than passing each form individual value as a prop to
      // CreateEditPostFields or writing separate methods to update each value.
      const existingValues = this.formValues;
      this.formValues = {
        ...existingValues,
        ...data,
      };
    },
  },
});
</script>
<template>
  <CreateEditPostFields
    :edit-mode="true"
    :post-loading="getPostLoading"
    :get-post-error="getPostError"
    :update-post-error="updatePostError"
    :form-values="formValues"
    @submit="submit"
    @updateFormValues="updateFormValues"
  />
</template>