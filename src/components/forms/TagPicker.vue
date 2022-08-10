
<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { TagData } from "@/types/tagTypes";
import { GET_TAGS } from "@/graphQLData/tag/queries";
import { useQuery } from "@vue/apollo-composable";
import Tag from "@/components/buttons/Tag.vue";
import RefreshIcon from "../icons/RefreshIcon.vue";

export default defineComponent({
  components: {
    Tag,
    RefreshIcon,
  },
  props: {
    hideSelected: {
      type: Boolean,
      default: false
    },
    selectedTags: {
      type: Array as PropType<string[]>,
      default: () => {
        return [];
      },
    },
    tagOptions: {
      type: Array as PropType<string[]>,
      default: () => {
        return [];
      },
    },
  },
  setup() {
    const {
      loading: tagsLoading,
      error: tagsError,
      result: tagsResult,
    } = useQuery(GET_TAGS);

    // We allow the user to select from all existing tags.
    const tagOptionLabels = computed(() => {
      if (!tagsResult.value || !tagsResult.value.tags) {
        return [];
      }
      return tagsResult.value.tags.map((tag: TagData) => tag.text);
    });

    return {
      tagsError,
      tagsLoading,
      tagOptionLabels,
    };
  },
  data(props) {
    return {
      selected: props.selectedTags,
    };
  },
  computed: {
     selectedTagsMap() {
        let map = {}
        for (let i = 0; i < this.selectedTags.length; i++) {
            const tag = this.selectedTags[i]
            map[tag] = true
        }
        return map
     }
  },
  methods: {
    resetTags() {
      this.selected = [];
      this.$emit("setSelectedTags", []);
    },
    select(tag: string) {
      this.selected.push(tag);
      this.$emit("setSelectedTags", this.selected);
    },
    deselect(tagToDeselect: string) {
      this.selected = this.selected.filter((tag: string) => {
        return tag !== tagToDeselect;
      });
      this.$emit("setSelectedTags", this.selected);
    },
  },
});
</script>
<template>
  <div>
    <div v-if="tagsLoading">Loading...</div>
    <div v-else-if="tagsError">
      <div v-for="(error, i) of tagsError?.graphQLErrors" :key="i">
        {{ error.message }}
      </div>
    </div>
    <div v-else class="divide-y divide-solid">
      <div class="tagpicker">
        <Tag
          :key="tag"
          v-for="tag in tagOptionLabels"
          :active="!!selectedTagsMap[tag]"
          :tag="tag"
          @select="select"
          @deselect="deselect"
        />
      </div>
      <div class="h-12">
        <button
          class="
            mt-2
            float-right
            inline-flex
            bg-white
            py-2
            px-4
            border border-gray-300
            rounded-md
            shadow-sm
            text-sm
            font-medium
            text-gray-700
            hover:bg-gray-50
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-blue-500
          "
          @click.prevent="resetTags"
        >
          <RefreshIcon class="mr-2 h-5" @click="resetTags"/>Reset
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
</style>
<style>

.tagpicker {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  max-width: 600px;
}
</style>
