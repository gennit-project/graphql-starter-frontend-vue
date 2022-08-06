
<script lang="ts">
import { defineComponent, PropType } from "vue";
import Tag from "@/components/buttons/Tag.vue";
import RefreshIcon from "../icons/RefreshIcon.vue";

export default defineComponent({
  props: {
    initialValue: {
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
  setup() {},
  components: {
    Tag,
    RefreshIcon,
  },
  data(props) {
    const formattedTagOptions = props.tagOptions.map((tag) => {
      return {
        value: tag,
        label: tag,
      };
    });
    return {
      selectedTags: props.initialValue,
      formattedTagOptions,
    };
  },
  methods: {
    resetTags() {
      this.selectedTags = [];
      this.$emit("setSelectedTags", this.selectedTags);
    },
    select(tag: string) {
      this.selectedTags.push(tag);
      this.$emit("setSelectedTags", this.selectedTags);
    },
    deselect(tagToDeselect: string) {
      this.selectedTags = this.selectedTags.filter((tag: string) => {
        return tag !== tagToDeselect;
      });
      this.$emit("setSelectedTags", this.selectedTags);
    },
  },
});
</script>
<template>
  <!-- <Multiselect
    v-model="selectedTags"
    class="wide"
    :classes="{
      containerActive: 'ring-0',
      tagsSearch:
        'absolute inset-0 border-0 outline-none focus:ring-0 appearance-none p-0 text-base font-sans box-border w-full',
    }"
    mode="tags"
    @select="$emit('setSelectedTags', selectedTags)"
    @deselect="$emit('setSelectedTags', selectedTags)"
    @clear="$emit('setSelectedTags', selectedTags)"
    :placeholder="'Enter tags here'"
    :closeOnSelect="false"
    :searchable="true"
    :options="formattedTagOptions"
  /> -->
  <div class="divide-y divide-solid">
    <div class="tagpicker">
      <Tag
        :selectedTags="selectedTags"
        :key="tag"
        v-for="tag in tagOptions"
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
        <RefreshIcon class="mr-2 h-5" />Reset
      </button>
    </div>
  </div>
</template>

<style lang="scss">
</style>
<style>
.wide {
  min-width: 250px;
}
.tagpicker {
  max-width: 400px;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}
</style>
