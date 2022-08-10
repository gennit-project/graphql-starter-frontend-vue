<script lang="ts">
import { defineComponent } from "vue";
import XmarkIcon from "../icons/XmarkIcon.vue";
export default defineComponent({
  components: {
    XmarkIcon
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    },
    tag: {
      type: String,
      required: true,
    },
  },
  computed: {
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
    @mouseenter="highlightedByMouse = true"
    @mouseleave="highlightedByMouse = false"
    @click="handleTagClick(tag, active)"
    :class="[clearable ? 'pr-1': 'cursor-pointer mr-1 pr-3', color, 'rounded-full pl-3  py-1 text-sm font-medium text-gray-900 tag']"
    >{{ tag }}
    <XmarkIcon
      class="h-4 cursor-pointer"
      v-if="clearable" 
      @click="$emit('delete', index)"
    />
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
