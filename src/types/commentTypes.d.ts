import { StringValueNode } from 'graphql';

export type CommentSectionData = {
    id: string;
    CommentsAggregate: {
        count: number;
    },
}