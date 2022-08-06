import { gql } from "@apollo/client/core";



// get post by ID
export const GET_POST = gql`
  query getPost($id: ID!) {
    posts(where: {id: $id}) {
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
`;