<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PostData } from "@/types/postTypes";
import { getDatePieces } from "@/utils/dateTimeUtils";
import { CommentSectionData } from "../../types/commentTypes";
import Tag from "../buttons/Tag.vue";
import HighlightedSearchTerms from "../forms/HighlightedSearchTerms.vue";
import { DateTime } from "luxon";

export default defineComponent({
  setup(props) {
    const startTimeObj = DateTime.fromISO(props.post.startTime);

    const { timeOfDay, weekday, month, day, year } = getDatePieces(
      startTimeObj
    );

    const now = DateTime.now();
    const currentYear = now.year;

    const formattedDate = `${weekday}, ${month} ${day}${
      year !== currentYear ? ", " + year : ""
    }`;

    return {
      formattedDate,
      timeOfDay,
    };
  },
  props: {
    post: {
      type: Object as PropType<PostData>,
      required: true,
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
  methods: {
    getCommentCount(commentSection: CommentSectionData) {
      const count = commentSection.CommentsAggregate.count;
      return ` ${count} comment${count === 1 ? "" : "s"}`;
    },

  },
  data() {
    return {
     
    };
  },
  components: {
    Tag,
    HighlightedSearchTerms,
  },
});
</script>

<template>
  <li :ref="`#${post.id}`" class="px-3">
    <div class="block">
      <div class="py-2">
        <div class="flex items-center">
          <p
            @click="$emit('clickedPostListItem')"
            class="
              text-sm
              font-medium
              text-blue-600
              truncate
              cursor-pointer
              underline
            "
          >
            <HighlightedSearchTerms
              :text="post.title"
              :search-input="searchInput"
            />
          </p>
        </div>
        <div v-if="post.description" class="items-center">
          <p class="text-sm font-medium text-gray-600 truncate">
            <HighlightedSearchTerms
              :text="post.description"
              :search-input="searchInput"
            />
          </p>
   
        </div>
        

        <div class="text-sm">
          <router-link
            
            :to="`/posts/p/${post.id}`"
            class="font-medium text-gray-500"
          >
            {{ getCommentCount(post.CommentSections[0]) }}
            <span aria-hidden="true">&rarr;</span>
          </router-link>
        </div>
        <Tag
          :highlighted-tags="selectedTags"
          :key="tag"
          v-for="tag in post.Tags"
          :tag="tag.text"
          @click="$emit('filterByTag', tag.text)"
        />
      </div>
    </div>
  </li>
</template>
<style>
.highlighted {
  background-color: #f9f95d;
}
</style>
