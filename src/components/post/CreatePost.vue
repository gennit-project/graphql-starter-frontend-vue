<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useMutation, provideApolloClient } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { gql } from "@apollo/client/core";
import { PostData, CreateEditPostFormValues } from "@/types/postTypes";
import CreateEditPostFields from "./CreateEditPostFields.vue";
import { CREATE_POST } from "@/graphQLData/post/mutations";
import { apolloClient } from "@/main";

export default defineComponent({
  name: "CreatePost",
  components: {
    CreateEditPostFields,
  },
  apollo: {},
  setup() {
    provideApolloClient(apolloClient);
    const router = useRouter();

    const createPostDefaultValues: CreateEditPostFormValues = {
      title: "",
      description: "",
      selectedTags: [],
      poster: "cluse",
    };

    const formValues = ref(createPostDefaultValues);

    const createPostInput = computed(() => {
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
        },
        Poster: {
          connectOrCreate: {
            onCreate: {
              node: {
                username: formValues.value.poster,
              },
            },
            where: {
              node: {
                username: formValues.value.poster,
              },
            },
          },
        },
      };

      return [input];
    }); // End of createPostInput

    const {
      mutate: createPost,
      error: createPostError,
      onDone,
    } = useMutation(CREATE_POST, () => {
      return {
        errorPolicy: "all",
        variables: {
          createPostInput: createPostInput.value,
        },
        update: (cache: any, result: any) => {
          const newPost: PostData = result.data.createPosts.posts[0];

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

                // Don't add the post if it is already in the cache.
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
      const newPostId = response.data.createPosts.posts[0].id;

      router.push({
        name: "PostDetail",
        params: {
          postId: newPostId,
        },
      });
    });

    return {
      createPost,
      createPostError,
      createPostInput,
      formValues,
      router,
    };
  },
  methods: {
    async submit() {
      this.createPost();
    },
    updateFormValues(data: CreateEditPostFormValues) {
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
    :create-post-error="createPostError"
    :edit-mode="false"
    :form-values="formValues"
    @submit="submit"
    @updateFormValues="updateFormValues"
  />
</template>