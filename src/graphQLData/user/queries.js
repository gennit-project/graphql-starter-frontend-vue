import { gql } from '@apollo/client/core';

export const GET_USER_INFO_FOR_TAGS = gql`
  query getUser($username: String!) {
    getUser(username: $username) {
      isAdmin
    }
  }
`;

export const GET_USER = gql`
  query getBasicUserInfo($username: String!) {
    getUser(username: $username) {
      username
      CommentsAggregate {
        count
      }
      PostsAggregate {
        count
      }
    }
}`;

export const USER_LOOKUP = gql`
  query getUser($username: String!) {
    getUser(username: $username) {
      username
      CommentsAggregate {
        count
      }
      PostsAggregate {
        count
      }
      Comments {
        id
        CommentSection {
          id
          Post {
            id
            title
          }
        }
        isRootComment
        ParentComment {
          id
        }
        UserAuthor {
          username
        }
        text
        authorIsPoster
        authorIsOriginalPoster
        deleted
        createdDate
        editedDate
        Tags {
          text
        }
      }
      Posts {
        id
        title
        startTime
        endTime
        Poster {
          username
        }
        Tags {
          text
        }
      }
    }
}`;

export const GET_USERS = gql`
  query {
    queryUser {
      username
    }
  }
`;