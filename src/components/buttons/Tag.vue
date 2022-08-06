<script lang="ts">
import { defineComponent, PropType, computed, ref } from "vue";


export default defineComponent({
  props: {
    tag: {
      type: String,
      required: true,
    },
    selectedTags: {
      type: Array as PropType<Array<String>>,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    active() {
      return this.selectedTags.includes(this.tag)
    },
    color() {
      if (this.active && !this.highlightedByMouse) {
        return 'active-tag'
      }
      if (this.active && this.highlightedByMouse) {
        return 'active-mouseover'
      }
      if (!this.active && !this.highlightedByMouse) {
        return 'inactive-tag'
      }
      return 'inactive-mouseover'
    }
  },
  data() {
    return { 
      highlightedByMouse: false
    };
  },
  methods: {
    handleTagClick(tag: string, active: boolean){
     if (active) {
      this.$emit('deselect', tag)
     } else {
      this.$emit('select', tag)
     }
  }
  }
});
</script>
<template>
  <span
    :class="color"
    @mouseenter="highlightedByMouse = true"
    @mouseleave="highlightedByMouse = false"
    @click="handleTagClick(tag, active)"
    class="
      rounded-full
      px-2
      py-1
      mr-1
      text-xs
      font-medium
      text-gray-900
      cursor-pointer
      tag
    "
    >{{ tag }}
  </span>
</template>

<style scoped>
.tag {
  display: inline-block;
  margin-bottom: 5px;
}
.active-tag {
  background-color: #037af9;
  color: white;
}
.active-mouseover {
  background-color: #036bdb;
  color: white;
}

.inactive-tag {
  background-color: #f2f2f4;
  color: #545455
}

.inactive-mouseover {
  background-color: #e1e1e3;
  color: #545455
}
</style>
