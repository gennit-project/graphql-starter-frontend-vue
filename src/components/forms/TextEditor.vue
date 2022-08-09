<script lang="ts">
import { defineComponent, ref } from "vue";
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

export default defineComponent({
  components: {
    MdEditor
  },
  setup(props) {
    return {
      showFormatted: ref(false),
      text: ref(props.selectedTags),
    };
  },
  props: {
    selectedTags: {
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
  },
});
</script>
<template>
  <md-editor
    v-model="text"
    language='en-US'
    previewTheme='github'
    @keyup="$emit('update', text)"
  /> 
</template>

<style>
.textbox {
  min-height: 150px;
}

.tabs {
  margin-bottom: -1px;
  background: 0 0;
  border-top: 1px solid transparent;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid gray;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
}
</style>