import { gql } from "@apollo/client/core";

export const CREATE_COMMENT = gql`
  mutation createComment(
    $createCommentInput: [CommentCreateInput!]!
  ){
    createComments(input: $createCommentInput) {
      comments {
        id
        text
        Author {
          username
        }
        ParentComment {
          id
        }
        createdAt
        updatedAt
        ChildCommentsAggregate {
          count
        }
        ChildComments {
          id
          text
          createdAt
          Author {
            username
          }
        }
      }
    }
  }`


export const UPDATE_COMMENT = gql`
mutation updateComment(
  $updateCommentInput: CommentUpdateInput
  $commentWhere: CommentWhere
) {
  updateComments(
    update: $updateCommentInput
    where: $commentWhere
  ) {
    comments {
      id
      text
      Author {
        username
      }
      createdAt
      updatedAt
    }
  }
}
`;


export const SOFT_DELETE_COMMENT = gql`
  mutation updateComments(
    $id: ID!
  ) {
    updateComments(
      update: {
        text: "[Deleted]",
      },
      disconnect: {
        Author: {
          where: {
            node_NOT: {
              username: "null"
            }
          }
        }
      },
      where: {
        id: $id
      }
    ) {
      comments {
        id
        text
        Author {
          username
        }
        createdAt
        updatedAt
      }
    }
  }
  `;

export const DELETE_COMMENT = gql`
  mutation deleteComment($id: ID!) {
      deleteComments(
        where: {
          id: $id
        }
    ) {
      nodesDeleted
      relationshipsDeleted    
    }
  }
`;
