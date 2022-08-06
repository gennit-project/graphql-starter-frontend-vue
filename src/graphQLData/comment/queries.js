import { gql } from "@apollo/client/core";

export const GET_COMMENT_BY_ID_WITH_REPLIES = gql`
  query getCommentByIdWithReplies($id: ID!) {
    getComment(id: $id) {
      id
      UserAuthor {
        username
      }
      text
      ChildComments {
        id
        UserAuthor {
          username
        }
        text
      }
      authorIsAdmin
      authorIsModerator
      authorIsPoster
      authorIsOriginalPoster
      deleted
      createdDate
      editedDate
      Tags {
        text
      }
      Emoji {
        id
        identifier
        name
        native
        colons
        addedBy {
          username
        }
      }
    }
  }
`;

// Get all comment IDs in post
// so that the comments can be deleted
// when the post is deleted. This query
// is needed because you can't cascade
// delete.
export const GET_COMMENT_IDS_IN_POST = gql`
  query getPost($eventId: ID!) {
    getPost(id: $eventId) {
      id
      Comments {
        id
      }
    }
  }
`;

export const GET_COMMENT_SECTION = gql`
  query getCommentSection($id: String!) {
    getCommentSection(id: $id) {
      id
      Post {
        id
      }
      Comments {
        id
        CommentSection {
          id
        }
        isRootComment
        ParentComment {
          id
        }
        UserAuthor {
          username
        }
        text
        authorIsAdmin
        authorIsModerator
        authorIsPoster
        authorIsOriginalPoster
        deleted
        createdDate
        editedDate
        Tags {
          text
        }
        Emoji {
          id
          identifier
          name
          native
          colons
          addedBy {
            username
          }
        }
      }
    }
  }
`;

export const ADD_COMMENT_SECTION = gql`
      mutation addCommentSection(
        $commentSectionObjects: [AddCommentSectionInput!]!
      ) {
        addCommentSection(input: $commentSectionObjects, upsert: true) {
          commentSection {
            id
            CommentsAggregate {
              count
            }
            Post {
              id
            }
            Comments {
              id
              text
              UserAuthor {
                username
              }
              deleted
              createdDate
              editedDate
              Tags {
                text
              }
            }
          }
        }
      }
    `;