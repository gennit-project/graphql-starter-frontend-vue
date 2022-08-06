<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import Back from "../buttons/Back.vue";
import Tag from "../buttons/Tag.vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import { DELETE_POST } from "@/graphQLData/post/mutations";
import { GET_POST } from "@/graphQLData/post/queries";
import Markdown from "vue3-markdown-it";
import { relativeTime } from "../../dateTimeUtils";
import ConfirmDelete from "../ConfirmDelete.vue";
import { DateTime } from "luxon";
import ErrorBanner from "../forms/ErrorBanner.vue";
import GenericButton from "../buttons/GenericButton.vue";

export default defineComponent({
  components: {
    Back,
    ConfirmDelete,
    ErrorBanner,
    GenericButton,
    Markdown,
    Tag,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const postId = computed(() => {
      return route.params.postId;
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

    return {
      createdAt,
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
    };
  },
  methods: {
    getFormattedDateString(startTime: string) {
      const startTimeObj = DateTime.fromISO(startTime);

      return startTimeObj.toFormat("cccc LLLL d yyyy");
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
    <div v-else  class="
        mx-auto
        max-w-4xl
        space-y-8
        divide-y
        bg-white
        p-8
        rounded
      ">
      <div class="grid grid-cols-3 gap-4">
        <div class="col-start-1 col-span-2">
          <h2 class="text-lg mb-2 text-gray-700">
            {{ post.title }}
          </h2>
          <div v-if="post.description" class="body prose prose-sm min-height-min">
            <Markdown :source="post.description" linkify html />
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
            <span>
              <router-link :to="`/posts/p/${postId}/edit`"
                ><GenericButton :text="'Edit'"
              /></router-link>
            </span>
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
    </div>
    <ErrorBanner
      class="mt-2"
      v-if="deletePostError"
      :text="deletePostError.message"
    />
  </div>
</template>