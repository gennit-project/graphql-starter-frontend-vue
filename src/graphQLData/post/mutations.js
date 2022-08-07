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
        createdAt
        Tags {
          text
        }
      }
    }
  }
  `;

export const UPDATE_POST = gql`
mutation ($updatePostInput: PostUpdateInput, $postWhere: PostWhere) {
  updatePosts(update: $updatePostInput, where: $eventWhere) {
    posts {
      id
      title
      description
      Poster {
        username
      }
      Tags {
        text
      }
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
