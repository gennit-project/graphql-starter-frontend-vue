<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import Back from "../buttons/Back.vue";
import Tag from "../buttons/Tag.vue";
import { gql } from "@apollo/client/core";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import { DELETE_POST } from "@/graphQLData/post/mutations";
// import { TagData } from "@/types/tagTypes.d";
import { PostData } from "@/types/postTypes";
import {
  relativeTime,
  formatDuration,
  getDurationObj,
} from "../../dateTimeUtils";
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
    Tag,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const postId = computed(() => {
      return route.params.postId;
    });

    const GET_POST = gql`
      query getPost($eventId: ID!) {
        posts(where: { id: $eventId }) {
          id
          title
          createdAt
          updatedAt
          description
         
          Poster {
            username
          }
         
          Tags {
            text
          }
        }
      }
    `;

    const {
      result: postResult,
      error: postError,
      loading: postLoading,
    } = useQuery(GET_POST, { postId });

    const postData = computed(() => {
      if (
        !postResult.value ||
        !postResult.value.posts ||
        !postResult.value.posts[0]
      ) {
        return null;
      }
      return postResult.value.posts[0];
    });

    // const isCreatorOfPost = () => {
    //   const username = getUsername(user)
    //   return username === organizerOfPost
    // }

    const confirmDeleteIsOpen = ref(false);

    const {
      mutate: deletePost,
      error: deletePostError,
      onDone: onDoneDeleting,
      // @ts-ignore
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
      })

    return {
      confirmDeleteIsOpen,
      postData,
      postResult,
      postError,
      postLoading,
      postId,
      // commentSectionId,
      deletePost,
      deletePostError,
      relativeTime,
    };
  },
  methods: {
    getTimeZone(startTime: string) {
      const startTimeObj = DateTime.fromISO(startTime);

      return startTimeObj.zoneName;
    },
    getFormattedDateString(startTime: string) {
      const startTimeObj = DateTime.fromISO(startTime);

      return startTimeObj.toFormat("cccc LLLL d yyyy");
    },

    getCalendarData(postData: PostData) {
      const {
        title,
        description,
      } = postData;

      return {
        name: title,
        details: description,
      };
    },
  },
});
</script>

<template>
  <div class="px-10">
    <Back />
    <p v-if="postLoading">Loading...</p>

    <p v-else-if="postError">{{ `GET_POST error: ${postError.message}` }}</p>

    <!-- <div v-if="!postData">
      <p>Could not find the post.</p>
      <router-link :to="`/posts`">
        <p>
          <i className="fas fa-arrow-left"></i> Go back to
          {{ `/posts` }}
        </p>
      </router-link>
    </div> -->

    <div v-else-if="postResult && postResult.posts">
      <ErrorBanner
        class="mt-2"
        v-if="deletePostError"
        :text="deletePostError.message"
      />
      <div class="grid grid-cols-3 gap-4">
        <div class="col-start-1 col-span-2">
          <h2 class="text-lg mb-2 text-gray-700">{{ postData.title }}</h2>
          <p class="mb-4" v-if="postData.description">
            {{ postData.description }}
          </p>
          <Tag
            v-for="tag in postData.Tags"
            :tag="tag.text"
            :key="tag.text"
            :postId="postId"
          />

          
          <div className="text-xs text-gray-600 mt-4">
            <div className="organizer">
              <router-link
                v-if="postData.Poster"
                class="text-blue-800 underline"
                :to="`/u/${postData.Poster.username}`"
              >
                {{ postData.Poster.username }}
              </router-link>
              {{
                `${
                  postData.createdAt
                    ? `posted ${relativeTime(
                        "" + postData.createdAt
                      )}`
                    : ""
                }`
              }}
              <span v-if="postData.updatedAt"> &#8226; </span>
              {{
                postData.updatedAt
                  ? `Edited ${relativeTime("" + postData.updatedAt)}`
                  : ""
              }}
              &#8226;
              <span
                class="underline font-medium text-gray-900 cursor-pointer"
                @click="confirmDeleteIsOpen = true"
                >Delete</span
              >
     
            </div>
            <div className="time-zone">
              {{ `Time zone: ${getTimeZone(postData.startTime)}` }}
            </div>
            <div className="created-date">
              {{
                `${
                  postData.createdAt
                    ? `Created ${relativeTime(postData.createdAt)}`
                    : ""
                }`
              }}
              <span v-if="postData.updatedAt"> &#8226; </span>
              {{
                postData.updatedAt
                  ? `${postData.updatedAt} Edited ${relativeTime(
                      postData.updatedAt
                    )}`
                  : ""
              }}
            </div>
            <span>
            <router-link
              :to="`/posts/p/${postId}/edit`"
              ><GenericButton :text="'Edit'"
            /></router-link>
          </span>
          </div>
        </div>

        <!-- <AddToCalendar :post="getCalendarData" /> -->
        <ConfirmDelete
          :title="'Delete Post'"
          :body="'Are you sure you want to delete this post?'"
          :open="confirmDeleteIsOpen"
          @close="confirmDeleteIsOpen = false"
          @delete="deletePost"
        />
      </div>
    </div>
  </div>
</template>