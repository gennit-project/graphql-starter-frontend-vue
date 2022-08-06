
import UserData from "./userTypes";
import TagData from "./tagTypes";
import CommentSectionData from "./commentTypes";

export type PostData = {
  id: string;
  title: string;
  description: string;
  deleted: boolean;
  Poster?: UserData;
  Tags: Array[TagData];
  CommentSections: [CommentSectionData];
  updatedAt: string;
  createdAt: string;
};

export type CreatePostFormValues =  {
  title: string;
  description: string;
  selectedTags: Array[string];
  poster: string;
}