<script lang="ts">
import { defineComponent, ref } from "vue";
import MdEditor from "md-editor-v3";
import EmojiExtension from "./EmojiExtension/index.vue";
import "md-editor-v3/lib/style.css";

export default defineComponent({
  components: {
    EmojiExtension,
    MdEditor,
  },
  setup(props) {
    return {
      editorId: "texteditor",
      showFormatted: ref(false),
      text: ref(props.initialValue),
    };
  },
  props: {
    initialValue: {
      type: String,
      default: "",
    },
  },
  methods: {
    setTab(selected: string) {
      this.selected = selected;
    },
    toggleShowFormatted() {
      this.showFormatted = !this.showFormatted;
    },
    updateText(text: string) {
      this.text = text;
      this.$emit("update", text);
    },
  },
  created() {
    this.$nextTick(() => {
      this.$refs.editor.$el.children[1].children[0].children[0].focus();
    });
  },
});
</script>
<template>
  <md-editor
    v-model="text"
    ref="editor"
    class="rounded-lg max-w-2xl"
    :editor-id="editorId"
    :preview="false"
    language="en-US"
    previewTheme="vuepress"
    :toolbars="[
      'bold',
      'underline',
      'italic',
      'strikeThrough',
      '-',
      'title',
      // 'sub',
      // 'sup',
      'quote',
      'unorderedList',
      'orderedList',
      'codeRow',
      'code',
      'link',
      // 'image',
      'table',
      // 'mermaid',
      // 'katex',
      // 0,
      // 1,
      // 2,
      '-',
      '=',
      'prettier',
      'pageFullscreen',
      'fullscreen',
      'preview',
      'htmlPreview',
      'catalog',
      'github'
    ]"
    @update:model-value="$emit('update', text)"
  >
    <template #defToolbars>
      <emoji-extension :editor-id="editorId" @on-change="updateText" />
    </template>
  </md-editor>
</template>
<style lang="scss">
.md-content .md-preview,
.md-content .md-html {
  word-break: break-word;
  width: 100%;
  font-size: 0.9rem;
}
.md-content .md-preview,
.md-content .md-html {
  word-break: break-word;
  width: 100%;
  padding: 0;
  margin: 0;

}
#md-editor-v3-preview > p, ul, ol, blockquote {
  font-size: 0.9rem;
  line-height: 1.5em;
  word-break: break-word;
}

#md-editor-v3-preview > p, ul, ol, li {
  line-height: 1.5em;
}


</style>