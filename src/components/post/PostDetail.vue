<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import Back from "../buttons/Back.vue";
import Tag from "../buttons/Tag.vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import { DELETE_POST } from "@/graphQLData/post/mutations";
import { GET_POST } from "@/graphQLData/post/queries";
import { CREATE_COMMENT } from "@/graphQLData/comment/mutations";
import { relativeTime } from "../../dateTimeUtils";
import ConfirmDelete from "../ConfirmDelete.vue";
import { DateTime } from "luxon";
import ErrorBanner from "../forms/ErrorBanner.vue";
import GenericButton from "../buttons/GenericButton.vue";
import CreateButton from "../buttons/CreateButton.vue";
import CancelButton from "../buttons/CancelButton.vue";
import SaveButton from "../buttons/SaveButton.vue";
import ProfileAvatar from "@/components/ProfileAvatar.vue";
import TextEditor from "@/components/comments/TextEditor.vue";
import MdEditor from "md-editor-v3";
import CommentSection from "@/components/comments/CommentSection.vue";
import { CommentData, CreateEditCommentFormValues } from "@/types/commentTypes";
import "md-editor-v3/lib/style.css";

export default defineComponent({
  components: {
    Back,
    CancelButton,
    CommentSection,
    ConfirmDelete,
    CreateButton,
    ErrorBanner,
    GenericButton,
    MdEditor,
    Tag,
    TextEditor,
    ProfileAvatar,
    SaveButton,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const postId = computed(() => {
      if (typeof route.params.postId === "string") {
        return route.params.postId;
      }
      return "";
    });

    const {
      result: getPostResult,
      error: getPostError,
      loading: getPostLoading,
    } = useQuery(GET_POST, { postId });

    const post = computed(() => {
      if (getPostError.value || getPostLoading.value) {
        return null;
      }
      return getPostResult.value.posts[0];
    });

    const editedAt = computed(() => {
      if (getPostError.value || getPostLoading.value || !post.value.updatedAt) {
        return "";
      }
      return `Edited ${relativeTime(post.value.updatedAt)}`;
    });

    const createdAt = computed(() => {
      if (getPostError.value || getPostLoading.value) {
        return "";
      }
      return `posted ${relativeTime(post.value.createdAt)}`;
    });

    const createCommentDefaultValues: CreateEditCommentFormValues = {
      text: "",
      isRootComment: true,
      depth: 1,
    };

    const createFormValues = ref<CreateEditCommentFormValues>(
      createCommentDefaultValues
    );

    const {
      mutate: deletePost,
      error: deletePostError,
      onDone: onDoneDeleting,
    } = useMutation(DELETE_POST, {
      variables: {
        id: postId.value,
      },
      update: (cache: any) => {
        cache.modify({
          fields: {
            posts(existingPostRefs = [], fieldInfo: any) {
              const readField = fieldInfo.readField;

              return existingPostRefs.filter((ref) => {
                return readField("id", ref) !== postId.value;
              });
            },
          },
        });
      },
    });

    onDoneDeleting(() => {
      router.push({
        name: "SearchPosts",
      });
    });

    const deleteModalIsOpen = ref(false);

    const createCommentInput = computed(() => {
      let input = {
        isRootComment: true,
        text: createFormValues.value.text || "",
        Author: {
          connect: {
            where: {
              node: {
                username: "cluse",
              },
            },
          },
        },
        Post: {
          connect: {
            where: {
              node: {
                id: postId.value,
              },
            },
          },
        },
      };

      return [input];
    });

    const { mutate: createComment } = useMutation(CREATE_COMMENT, () => ({
      errorPolicy: "all",
      variables: {
        createCommentInput: createCommentInput.value,
      },
      update: (cache: any, result: any) => {
        const newComment: CommentData =
          result.data?.createComments?.comments[0];
        // Will use readQuery and writeQuery to update the cache
        // https://www.apollographql.com/docs/react/caching/cache-interaction/#using-graphql-queries

        const readQueryResult = cache.readQuery({
          query: GET_POST,
          variables: {
            postId: postId.value,
          },
        });

        const existingPostData = readQueryResult?.posts[0];

        let rootCommentsCopy = [
          newComment,
          ...(existingPostData?.Comments || []),
        ];

        let existingCommentAggregate = existingPostData?.CommentsAggregate
          ? existingPostData.CommentsAggregate
          : null;

        let newCommentAggregate = null;

        if (existingCommentAggregate) {
          newCommentAggregate = {
            ...existingCommentAggregate,
            count: existingCommentAggregate.count + 1,
          };
        }

        cache.writeQuery({
          query: GET_POST,
          data: {
            ...readQueryResult,
            posts: [
              {
                ...existingPostData,
                Comments: rootCommentsCopy,
                CommentsAggregate: newCommentAggregate
                  ? newCommentAggregate
                  : existingCommentAggregate,
              },
            ],
            variables: {
              id: postId.value,
            },
          },
        });
      },
    }));

    return {
      createComment,
      createdAt,
      createFormValues,
      deleteModalIsOpen,
      getPostResult,
      getPostError,
      getPostLoading,
      postId,
      deletePost,
      deletePostError,
      editedAt,
      post,
      relativeTime,
      showEditor: ref(false),
    };
  },
  methods: {
    getFormattedDateString(startTime: string) {
      const startTimeObj = DateTime.fromISO(startTime);

      return startTimeObj.toFormat("cccc LLLL d yyyy");
    },
    async handleCreateComment() {
      this.createComment();
    },
    handleUpdateComment(event: any) {
      this.createFormValues.text = event;
    },
    updateCreateInputValuesForRootComment(text: string) {
      this.createFormValues.text = text;
    },
  },
});
</script>

<template>
  <div class="px-10">
    <Back />
    <p v-if="getPostLoading">Loading...</p>
    <ErrorBanner
      class="mt-2"
      v-else-if="getPostError"
      :text="getPostError.message"
    />
    <div v-else class="mx-auto space-y-8 divide-y bg-white p-8 rounded">
      <div class="mt-4 mb-4 md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h1 class="mt-4 text-2xl max-w-2xl">
            {{ post.title }}
          </h1>
        </div>
        <div class="flex-shrink-0 flex md:mx-4">
          <div class="float-right">
            <span>
              <router-link :to="`/posts/p/${postId}/edit`">
                <GenericButton :text="'Edit'" />
              </router-link>
              <CreateButton
                class="ml-2"
                :to="`/posts/create`"
                :label="'Create Post'"
              />
            </span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div class="col-start-1 col-span-2">
          <div v-if="post.description" class="body min-height-min">
            <md-editor
              v-model="post.description"
              language="en-US"
              previewTheme="github"
              preview-only
            />
          </div>
          <Tag
            v-for="tag in post.Tags"
            :tag="tag.text"
            :key="tag.text"
            :postId="postId"
          />
          <div className="text-xs text-gray-600 mt-4">
            <div className="organizer">
              <router-link
                v-if="post.Poster"
                class="text-blue-800 underline"
                :to="`/u/${post.Poster.username}`"
              >
                {{ post.Poster.username }}
              </router-link>
              {{ createdAt }}
              <span v-if="post.updatedAt"> &#8226; </span>
              {{ editedAt }}
              &#8226;
              <span
                class="underline font-medium text-gray-900 cursor-pointer"
                @click="deleteModalIsOpen = true"
                >Delete</span
              >
            </div>
          </div>
        </div>
        <ConfirmDelete
          :title="'Delete Post'"
          :body="'Are you sure you want to delete this post?'"
          :open="deleteModalIsOpen"
          @close="deleteModalIsOpen = false"
          @delete="deletePost"
        />
      </div>
      <div class="mt-1 flex space-x-2 py-2">
        <ProfileAvatar class="h-5 w-5" />
        <textarea
          v-if="!showEditor"
          id="addcomment"
          @click="showEditor = true"
          name="addcomment"
          rows="1"
          placeholder="Write a reply"
          class="
            block
            w-full
            rounded-md
            border-gray-300
            shadow-sm
            text-sm
            max-w-2xl
            focus:border-indigo-500 focus:ring-indigo-500
          "
        />
        <div v-else>
          <TextEditor
            class="mb-3 h-48"
            :placeholder="'Please be kind'"
            @update="handleUpdateComment"
          />
          <!-- <ErrorBanner v-if="createCommentError"
                         :text="createCommentError.message" /> -->
          <div class="flex justify-start">
            <CancelButton @click="showEditor = false" />
            <SaveButton
              @click.prevent="
                () => {
                  handleCreateComment();
                  showEditor = false;
                }
              "
              :disabled="this.createFormValues.text.length === 0"
            />
          </div>
        </div>
      </div>
      <div v-if="post.Comments.length === 0">
        <h2 class="text-xl" id="comments" ref="commentSectionHeader">
          {{ `Comments (0)` }}
        </h2>
        <p>There are no comments yet.</p>
      </div>
      <div v-else>
        <h2 id="comments" ref="commentSectionHeader" class="text-xl max-w-2xl">
          {{ `Comments (${post.CommentsAggregate.count})` }}
        </h2>
        <CommentSection
          ref="commentSectionRef"
          :comments="post.Comments"
          :post-id="postId"
        />
      </div>
    </div>
    <ErrorBanner
      class="mt-2"
      v-if="deletePostError"
      :text="deletePostError.message"
    />
  </div>
</template>