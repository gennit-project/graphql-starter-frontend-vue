<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { PostData } from "@/types/postTypes";
import { getDatePieces } from "@/utils/dateTimeUtils";
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

    const selectedTagMap = computed(() => {
      let map = {}
      for (let i = 0; i < props.selectedTags.length; i++) {
        const selectedTag = props.selectedTags[i]
        map[selectedTag] = true
      }
      return map
    })

    return {
      formattedDate,
      selectedTagMap,
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
        <p class="text-sm">{{ `${post.CommentsAggregate.count} ${post.CommentsAggregate.count === 1 ? 'comment' : 'comments'}` }}</p>
        <Tag
          :active="!!selectedTagMap[tag.text]"
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
