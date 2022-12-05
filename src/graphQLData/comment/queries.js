import { gql } from '@apollo/client/core'

export const GET_COMMENT_REPLIES = gql`
query getCommentWithReplies($id: ID!){
  comments(where: {
		id: $id
	}){
    id
    ChildCommentsAggregate {
      count
    }
	ChildComments {
			id
      Author {
        username
      }
			text
      ParentComment {
        id
      }
      ChildCommentsAggregate {
        count
      }
	}
  }
}
`