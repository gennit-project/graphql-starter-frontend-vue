import { gql } from "@apollo/client/core";

export const ADD_COMMENT_SECTION = gql`
    mutation addCommentSection (
      $commentSectionObjects: [AddCommentSectionInput!]!,
    ) {
      addCommentSection(
        input: $commentSectionObjects,
        upsert:true
      ) {
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
  `

export const ADD_COMMENT_TAG = gql`
  mutation updateComment(
      $id: ID!,       # Comment ID
      $text: String!, # text of the tag
    ) {
    updateComment(
      input: { 
        filter: { 
          id: [$id] 
        }, 
        set: { 
          Tags: [{
            text: $text,
          }]
        }
      }
    ) {
      comment {
        id
        UserAuthor {
          username
        }
        text
        editedDate
        createdDate
        Tags {
          text
        }
      }
    }
}`;

export const ADD_COMMENT_EMOJI = gql`
  mutation updateComment(
      $id: ID!,             # Comment ID
      $identifier: String!, # Unique code for an emoji
      $name: String!        # The human readable name of the emoji
      $colons: String!      # Text that can be used for searching emoji
      $native: String!      # The actual emoji image
      $username: String!    # The person adding an emoji
    ) {
    updateComment(
      input: { 
        filter: { 
          id: [$id] 
        }, 
        set: { 
          Emoji: [{
            identifier: $identifier,
            name: $name
            colons: $colons
            native: $native
            addedBy: {
              username: $username
            }
          }]
        }
      }
    ) {
      comment {
        id
        UserAuthor {
          username
        }
        text
        editedDate
        createdDate
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
}`;


export const REMOVE_COMMENT_TAG = gql`
  mutation updateComment (
      $commentId: ID!,
      $text: String!
    ) {
      updateComment(
        input: {
          filter: {
            id: [$commentId]
          }
          remove: { 
            Tags: {
              text: $text
            } 
          }
      }){
          comment {
            id
            UserAuthor {
              username
            }
            text
            editedDate
            createdDate
            Tags {
              text
            }
          }
      }
  }
`



export const DELETE_COMMENTS = gql`
  mutation deleteComment($commentIds: [ID!]) {
    deleteComment(filter: { id: $commentIds }) {
      comment {
        id
        UserAuthor {
          username
        }
        text
      }
    }
  }
`;