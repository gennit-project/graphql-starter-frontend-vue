import { gql } from "@apollo/client/core";

export const GET_TAGS = gql`
  query getTags {
    tags {
      text
    }
  }
`;
