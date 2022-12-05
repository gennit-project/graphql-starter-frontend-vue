
import UserData from "./userTypes";
import TagData from "./tagTypes";

export type PostData = {
  id: string;
  title: string;
  description: string;
  deleted: boolean;
  Poster?: UserData;
  Tags: Array[TagData];
  updatedAt: string;
  createdAt: string;
  CommentsAggregate: {
    count: number;
  }
};

interface CreateEditPostFormValues {
  title: string;
  description: string;
  selectedTags: Array[string];
  poster?: string;
}