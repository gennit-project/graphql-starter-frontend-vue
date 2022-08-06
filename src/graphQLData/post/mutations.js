import { gql } from "@apollo/client/core";

export const CREATE_POST = gql`
  mutation ($createPostInput: [PostCreateInput!]!) {
    createPosts(input: $createPostInput) {
      posts {
        id
        title
        description
        Poster {
          username
        }
        endTime
        createdAt
      
        Tags {
          text
        }
      }
    }
  }
  `;

// Update post
export const UPDATE_POST = gql`
  mutation updatePost(
    $id: ID!
    $title: String
    $Tags: [TagRef!]
    $description: String
    $editedDate: DateTime
  ) {
    updatePost(
      input: {
        filter: { id: [$id] }
        set: {
          Tags: $Tags
          title: $title
          description: $description
          editedDate: $editedDate
          cost: $cost
        }
      }
    ) {
      post {
        id
        title
        description
        Tags {
          text
        }
        createdDate
        editedDate
      }
    }
  }
`;


export const DELETE_POSTS = gql`
  mutation deletePost($id: [ID!]) {
    deletePost(filter: { id: $id }) {
      post {
        id
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
      deletePosts(
        where: {
          id: $id
        }
    ) {
      nodesDeleted
      relationshipsDeleted    
    }
  }
`;
