import { StringValueNode } from 'graphql'
import { TagData } from './tagTypes'
import UserData from './userTypes'
import { PostData } from './postTypes'

export type CreateEditCommentFormValues = {
  depth: number
  parentCommentId?: string
  text: string
  tags?: [TagData]
  isRootComment?: boolean
}

export type CreateReplyInputData = {
  parentCommentId: string
  text: string
  depth: number
}

export type DeleteCommentInputData = {
  parentCommentId: string
  commentId: string
  replyCount: number
}

export type CommentData = {
  id: string
  Author: UserData
  text: string
  isRootComment: Boolean
  Post: PostData
  ParentComment?: CommentData
  ChildCommentsAggregate?: { 
    count: number
  }
  ChildComments?: [Comment]
  deleted?: boolean
  updatedAt?: string
  createdAt: string
  Tags?: [TagData]
}
