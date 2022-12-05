<script lang="ts">
import { defineComponent, ref, computed, PropType } from "vue";
import { useRoute } from "vue-router";
import Comment from "./Comment.vue";
// import LoadMore from "../LoadMore.vue";
import {
  CommentData,
  CreateEditCommentFormValues,
  CreateReplyInputData,
  DeleteCommentInputData,
} from "@/types/commentTypes";
import { GET_COMMENT_REPLIES } from "@/graphQLData/comment/queries";
import {
  DELETE_COMMENT,
  UPDATE_COMMENT,
  SOFT_DELETE_COMMENT,
} from "@/graphQLData/comment/mutations";
import { useMutation } from "@vue/apollo-composable";
import WarningModal from "../WarningModal.vue";
import { GET_POST } from "@/graphQLData/post/queries";
import { CREATE_COMMENT } from "@/graphQLData/comment/mutations";
import type { Ref } from "vue";

export default defineComponent({
  props: {
    comments: {
      type: Array as PropType<Array<CommentData>>,
      required: true,
    },
    postId: {
      type: String,
      required: true
    }
  },
  components: {
    Comment,
    // LoadMore,
    WarningModal,
  },
  setup(props) {
    const route = useRoute();

    const commentToDeleteId = ref("");
    const commentToDeleteReplyCount = ref(0);
    const parentOfCommentToDelete = ref("");
    const commentToEdit: Ref<CommentData | null> = ref(null);

    const editFormValues = ref<CreateEditCommentFormValues>({
      text: commentToEdit.value?.text || "",
      isRootComment: true, // changes to false for 2nd level comments and below
      depth: 1,
    });

    const createCommentDefaultValues: CreateEditCommentFormValues = {
      text: "",
      isRootComment: false,
      depth: 1,
    };

    const createFormValues = ref<CreateEditCommentFormValues>(
      createCommentDefaultValues
    );

    const updateCommentInput = computed(() => {
      return {
        text: editFormValues.value?.text || "",
        isRootComment: editFormValues.value?.isRootComment,
      };
    });
    const { mutate: editComment } = useMutation(UPDATE_COMMENT, () => ({
      variables: {
        commentWhere: {
          id: commentToEdit.value?.id || "",
        },
        updateCommentInput: updateCommentInput.value,
      },
    }));

    const { mutate: deleteComment } = useMutation(DELETE_COMMENT, {
      update: (cache: any) => {
        if (parentOfCommentToDelete.value) {
          // For child comments, update the parent comment's replies
          cache.modify({
            id: cache.identify({
              __typename: "Comment",
              id: parentOfCommentToDelete.value,
            }),
            fields: {
              ChildComments(existingComments: any, { readField }: any) {
                return existingComments.filter((comment: any) => {
                  return readField("id", comment) !== commentToDeleteId.value;
                });
              },
            },
          });
        } else {
          // For root comments, update the post query result
          cache.modify({
            id: cache.identify({
              __typename: "Post",
              id: props.postId,
            }),
            fields: {
              Comments(existingComments: any, { readField }: any) {
                return existingComments.filter((comment: any) => {
                  return readField("id", comment) !== commentToDeleteId.value;
                });
              },
            },
          });
        }
        // For both root comments and replies, update the aggregate
        // count of the comment section
        cache.modify({
          id: cache.identify({
            __typename: "Post",
            id: props.postId,
          }),
          fields: {
            CommentsAggregate(existingValue: any) {
              return {
                ...existingValue,
                count: existingValue.count - 1,
              };
            },
          },
        });
      },
    });

    // The soft delete is for comments that have
    // replies. It replaces the text with [deleted]
    // and removes the author name, but leaves the comment
    // so that the replies are still visible.
    const { mutate: softDeleteComment } = useMutation(SOFT_DELETE_COMMENT);

    const createCommentInput = computed(() => {
      //   const tagConnections = formValues.value.tags.map(
      //     (tag: string) => {
      //       return {
      //         onCreate: {
      //           node: {
      //             text: tag,
      //           },
      //         },
      //         where: {
      //           node: {
      //             text: tag,
      //           },
      //         },
      //       };
      //     }
      //   );

      const input = {
        isRootComment: false,
        Post: {
          connect: {
            where: {
              node: {
                id: props.postId,
              },
            },
          },
        },
        ParentComment: {
          connect: {
            where: {
              node: {
                id: createFormValues.value.parentCommentId,
              },
            },
          },
        },
        text: createFormValues.value.text || "",
        Author: {
          connect: {
            where: {
              node: {
                username: "cluse",
              },
            },
          },
        },
      };
      return [input];
    });

    const { mutate: createComment, error: createCommentError } = useMutation(
      CREATE_COMMENT,
      () => ({
        errorPolicy: "all",
        variables: {
          createCommentInput: createCommentInput.value,
        },
        update: (cache: any, result: any) => {

          if (createFormValues.value.depth > 1) {
            // For nested comments, first
            // check if there are already replies to the parent
            // comment.
            const readQueryResult = cache.readQuery({
              query: GET_COMMENT_REPLIES,
              variables: {
                id: createFormValues.value.parentCommentId,
              },
            });

            if (!readQueryResult) {
              // If we have not yet tried to fetch the replies
              // of the parent comment, it is probably because
              // the reply count was 0. Changing the count to 1
              // should cause the replies to be fetched.
              cache.modify({
                id: cache.identify({
                  __typename: "Comment",
                  id: createFormValues.value.parentCommentId,
                }),
                fields: {
                  ChildCommentsAggregate(existingValue: any) {
                    return {
                      ...existingValue,
                      count: existingValue.count + 1,
                    };
                  },
                },
              });
            }

            if (readQueryResult) {
              const parentComment = readQueryResult?.comments[0];

              const existingReplies = parentComment?.ChildComments;

              // If there are NOT already replies to the parent
              // comment, edit the aggregate count
              // of child comments on the parent comment. That should
              // trigger the GET_COMMENT_REPLIES query to be fetched.

              const existingChildCommentAggregate =
                parentComment?.ChildCommentsAggregate;
              let newChildCommentAggregate = null;

              if (existingChildCommentAggregate) {
                newChildCommentAggregate = {
                  ...existingChildCommentAggregate,
                  count: 1,
                };
              }
              const newComment: CommentData =
            result.data?.createComments?.comments[0];

              cache.writeQuery({
                query: GET_COMMENT_REPLIES,
                data: {
                  ...readQueryResult,
                  comments: [
                    {
                      ...parentComment,
                      ChildComments: [newComment, ...existingReplies],
                      ChildCommentAggregate: newChildCommentAggregate
                        ? newChildCommentAggregate
                        : existingChildCommentAggregate,
                    },
                  ],
                },
                variables: {
                  id: createFormValues.value.parentCommentId,
                },
              });
            }

            // Update the total count of comments on the post
            const readPostQueryResult = cache.readQuery({
              query: GET_POST,
              variables: {
                postId: props.postId,
              },
            });

            const existingPostData = readPostQueryResult?.posts[0];

            let existingCommentAggregate = existingPostData?.CommentsAggregate
              ? existingPostData.CommentsAggregate
              : null;

            let newCommentAggregate = null;

            if (existingCommentAggregate) {
              newCommentAggregate = {
                ...existingCommentAggregate,
                count: existingCommentAggregate.count + 1,
              };
            }

            cache.writeQuery({
              query: GET_POST,
              data: {
                ...readQueryResult,
                posts: [
                  {
                    ...existingPostData,
                    CommentsAggregate: newCommentAggregate
                      ? newCommentAggregate
                      : existingCommentAggregate,
                  },
                ],
                variables: {
                  id: props.postId,
                },
              },
            });
          }
        },
      })
    );

    // const reachedEndOfResults = ref(false);

    // const loadMore = () => {
    //   fetchMore({
    //     variables: {
    //       offset: commentResult.value.comments.length,
    //     },
    //     updateQuery: (previousResult, { fetchMoreResult }) => {
    //       if (!fetchMoreResult) return previousResult;

    //       return {
    //         ...previousResult,
    //         comments: [
    //           ...previousResult.comments,
    //           ...fetchMoreResult.comments,
    //         ],
    //       };
    //     },
    //   });
    // };

    return {
      commentToEdit,
      commentToDeleteId,
      commentToDeleteReplyCount,
      createComment,
      createCommentError,
      createCommentInput,
      createFormValues,
      editComment,
      deleteComment,
      editFormValues,
      parentOfCommentToDelete,
      showDeleteCommentModal: ref(false),
      //   loadMore,
      //   reachedEndOfResults,
      route,
      softDeleteComment,
    };
  },

  methods: {
    updateCreateInputValuesForReply(input: CreateReplyInputData) {
      const { text, parentCommentId, depth } = input;
      if (!parentCommentId) {
        throw new Error("parentCommentId is required to reply to a comment");
      }
      this.createFormValues = {
        ...this.createFormValues,
        text,
        parentCommentId,
        depth,
      };
    },
    updateEditInputValues(text: string, isRootComment: boolean) {
      this.editFormValues.isRootComment = isRootComment;
      this.editFormValues.text = text;
    },
    handleClickCreate() {
      // Reply to a comment
      this.createComment();
    },
    handleClickEdit(commentData: CommentData) {
      this.commentToEdit = commentData;
    },
    handleClickDelete(input: DeleteCommentInputData) {
      const { commentId, parentCommentId, replyCount } = input;
      this.showDeleteCommentModal = true;
      this.commentToDeleteId = commentId;
      this.commentToDeleteReplyCount = replyCount;
      this.parentOfCommentToDelete = parentCommentId;
    },
    handleSaveEdit() {
      this.editComment();
    },
    handleDeleteComment() {
      if (this.commentToDeleteReplyCount > 0) {
        // Soft delete the comment if there are replies
        // to allow the replies to remain visible
        this.softDeleteComment({ id: this.commentToDeleteId });
      }
      if (this.commentToDeleteReplyCount === 0) {
        // Hard delete the comment if there are no replies
        // to avoid cluttering the screen
        this.deleteComment({ id: this.commentToDeleteId });
      }
    },
  },
  inheritAttrs: false,
});
</script>
<template>
  <div class="sm:rounded-md pt-4">
    <Comment
      v-for="comment in comments"
      :key="comment.id"
      :compact="true"
      :commentData="comment"
      :depth="1"
      @clickEditComment="handleClickEdit"
      @deleteComment="handleClickDelete"
      @createComment="handleClickCreate"
      @updateCreateReplyCommentInput="updateCreateInputValuesForReply"
      @updateEditCommentInput="updateEditInputValues"
      @saveEdit="handleSaveEdit"
    />
    <WarningModal
      :title="'Delete Comment'"
      :body="'Are you sure you want to delete this comment?'"
      :open="showDeleteCommentModal"
      @close="showDeleteCommentModal = false"
      @primaryButtonClick="handleDeleteComment"
    />
  </div>
</template>
<style scoped>
h2 {
  font-size: 1.65em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}
</style>