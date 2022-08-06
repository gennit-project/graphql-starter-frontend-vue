import { createRouter, createWebHistory } from "vue-router";
import UserProfile from "./components/UserProfile.vue";
import PostDetail from "./components/post/PostDetail.vue";
import SearchPosts from "./components/post/SearchPosts.vue";
import CreatePost from "@/components/post/CreatePost.vue";
import EditPost from "@/components/post/EditPost.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: SearchPosts,
    },
    {
      name: 'SearchPosts',
      path: "/posts",
      component: SearchPosts,
    },
    {
      path: "/posts/create",
      name: "CreatePost",
      component: CreatePost,
    },
    {
      name: "PostDetail",
      path: "/posts/p/:postId",
      component: PostDetail,
    },
    {
      name: "EditPost",
      path: "/posts/p/:postId/edit",
      component: EditPost,
    },
    { path: "/u/:username", component: UserProfile },
  ],
});
