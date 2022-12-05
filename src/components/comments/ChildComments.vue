<script lang="ts">
import { defineComponent, computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { GET_COMMENT_REPLIES } from "@/graphQLData/comment/queries";

export default defineComponent({

  setup(props) {
    // The only reason this component exists is because you can't
    // conditionally use the useQuery hook. To work around that,
    // I have placed the useQuery hook in this component, then
    // this component is conditionally rendered in the Comment component.

    // This query needs to be conditional because we shouldn't
    // always load all of the replies.
    const {
      result: commentResult,
      error: commentError,
      loading: commentLoading,
      //   fetchMore,
    } = useQuery(GET_COMMENT_REPLIES, {
      id: props.parentCommentId,
      // limit: 25,
      // offset: 0,
    });

    const comments = computed(() => {
        if (commentLoading.value || commentError.value){
            return []
        }
        const parentComment = commentResult.value.comments[0]
        if (parentComment) {
            return parentComment.ChildComments
        }
        return []
    })
    return {
      commentError,
      commentLoading,
      comments
    };
  },
  props: {
    parentCommentId: {
      type: String,
      required: true
    },
  },
});
</script>
<template>
    <div v-if="commentLoading">Loading...</div>
    <div v-else-if="commentError">{{ commentError.message }}</div>
    <div v-else>
        <slot :comments="comments"></slot>
    </div>
</template>
