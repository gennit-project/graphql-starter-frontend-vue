<script lang="ts">
// This component uses some code from this CodePen: https://codepen.io/foucauld-gaudin/pen/abzBdRz
import { defineComponent, PropType } from "vue";
import Tag from "../buttons/Tag.vue";
import TagPicker from "@/components/forms/TagPicker.vue";
import FloatingDropdown from "./FloatingDropdown.vue";

export default defineComponent({
  components: {
    FloatingDropdown,
    Tag,
    TagPicker,
  },
  setup() {},
  props: {
    selectedTags: {
      type: Array as PropType<string[]>,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      tags: this.selectedTags,
      currentInput: "",
      set: true,
    };
  },
  methods: {
    saveTag() {
      const { tags, currentInput, set } = this;
      if ((set && tags.indexOf(currentInput) === -1) || !set) {
        tags.push(currentInput);
      }
      this.currentInput = "";
      this.$emit("setSelectedTags", [...this.tags]);
    },
    setSelectedTags(tags: Array<string>) {
      this.tags = tags;
      this.$emit("setSelectedTags", [...this.tags]);
    },
    deleteTag(index: number) {
      this.tags.splice(index, 1);
      this.$emit("setSelectedTags", [...this.tags]);
    },
    backspaceDelete(input: any) {
      if (input.which == 8 && this.currentInput === "") {
        this.tags.splice(this.tags.length - 1);
        this.$emit("setSelectedTags", [...this.tags]);
      }
    },
  },
});
</script>

<template>
  <FloatingDropdown>
    <template v-slot:button>
      <div
        class="
          tag-container
          pt-0.5
          pb-0.5
          flex
          relative
          rounded
          shadow-sm
          border border-gray-300
        "
      >
        <Tag
          v-for="(tag, i) of tags"
          :key="tag"
          :active="true"
          :clearable="true"
          :tag="tag"
          :index="i"
          @delete="deleteTag($event)"
        />
        <input
          class="flex-1 block min-w-0 pl-3 pt-2 pb-2 rounded sm:text-sm"
          v-model="currentInput"
          placeholder="Add tags"
          @keypress.enter="saveTag"
          @keydown.delete="backspaceDelete"
        />
      </div>
    </template>
    <template v-slot:content>
      <TagPicker
        :selected-tags="selectedTags"
        :hide-selected="true"
        @setSelectedTags="setSelectedTags"
      />
    </template>
  </FloatingDropdown>
</template>

<style lang="scss" scoped>
.tag-container {
  width: 100%;
  min-height: 34px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  .tag {
    margin: 4px;
    display: flex;
    align-items: center;
    i {
      cursor: pointer;
      opacity: 0.56;
      margin-left: 8px;
    }
  }
  input {
    flex: 1 1 auto;
    width: 30px;
    border: none;
    outline: none;
  }
}
</style>