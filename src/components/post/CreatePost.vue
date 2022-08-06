<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useMutation, provideApolloClient } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { gql } from "@apollo/client/core";
import { TagData } from "@/types/tagTypes";
import { PostData, CreatePostFormValues } from "@/types/postTypes";
import CreateEditFormFields from "./CreateEditFormFields.vue";
import { CREATE_POST } from "@/graphQLData/post/mutations";
import { apolloClient } from "@/main";
// import { CREATE_COMMENT_SECTION } from "@/graphQLData/comment/queries";

export default defineComponent({
  name: "CreatePost",
  components: {
    CreateEditFormFields,
  },
  apollo: {},
  setup() {
    provideApolloClient(apolloClient);
    const router = useRouter();

    const createPostDefaultValues: CreatePostFormValues = {
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
          connect: {
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
          const newPost: PostData = result.data?.createPosts?.posts[0];

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
      const router = useRouter();

      router.push({
        name: "PostDetail",
        params: {
          postId: newPostId,
        },
      });
    });

    const tagOptionLabels = computed(() => {
      return formValues.value.selectedTags.map((tag: TagData) => tag.text);
    });

    return {
      createPost,
      createPostError,
      createPostInput,
      router,
      tagOptionLabels,
      formValues,
    };
  },
  data() {
    return {
      showCostField: false,
    };
  },
  computed: {
    changesRequired() {
      console.log("Debug changes required", {
        title: this.title,
      });
      const needsChanges = !(this.title.length > 0);
      return needsChanges;
    },
  },
  methods: {
    async submit() {
      this.createPost();
    },
    cancel() {
      this.router.push({
        name: "SearchPosts",
      });
    },
    updateFormValues(data: PostData) {
      const existingValues = this.formValues.value;

      this.formValues.value = {
        ...existingValues,
        ...data,
      };
    },
  },
});
</script>
<template>
  <CreateEditFormFields
    :create-post-error="createPostError"
    :edit-mode="false"
    :form-values="formValues"
    @cancel="cancel"
    @submit="submit"
    @updateFormValues="updateFormValues"
  />
</template>