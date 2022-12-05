import { gql } from "@apollo/client/core";

export const GET_POST = gql`
      query getPost($postId: ID!) {
        posts(where: { id: $postId }) {
          id
          title
          createdAt
          updatedAt
          description
          Poster {
            username
          }
          Tags {
            text
          }
          CommentsAggregate {
            count
          }
          Comments (where: {
            isRootComment: true
          }){
                id
                text
                Author {
                  username
                }
                createdAt
                updatedAt
                ChildCommentsAggregate {
                  count
                }
                ChildComments {
                  id 
                  text
                  Author {
                    username
                  }
                  ChildCommentsAggregate {
                    count
                  }
                }
          }
        }
      }
    `;