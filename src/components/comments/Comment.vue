<script>
import { defineComponent } from "vue";
import Markdown from "vue3-markdown-it";
// @ts-ignore
import ProfileAvatar from "vue-profile-avatar";
import { relativeTime } from "../../dateTimeUtils";

export default defineComponent({
  components: {
    Markdown,
    ProfileAvatar,
  },
  setup() {
    return {
      relativeTime,
    };
  },
  props: {
    authorUsername: {
      type: String,
      default: '',
    },
    createdAt: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: "",
    },
  },
});
</script>
<template>
  <div
    class="
      text-gray-500
      md:col-span-9
      sm:col-span-12
      flex
      space-x-4
      mt-2
    "
  >
    <ProfileAvatar
      v-if="authorUsername"
      :username="authorUsername"
      colorType="pastel"
    ></ProfileAvatar>

    <div class="tip left w-4/5 rounded">
      <div class="header text-xs p-2 text-gray-800">
        <router-link v-if="authorUsername" class="underline font-bold" :to="`/u/${authorUsername}`">
          {{ `${authorUsername ? authorUsername : "[deleted]"}` }}
        </router-link>
      </div>
      <div class="body prose prose-sm min-height-min">
        <Markdown v-if="content" :source="content" linkify html />
      </div>
    </div>
  </div>
</template>



<style>
</style>


<style scoped>
.left {
  min-height: auto !important;
  float: left;
}

.left > p:first-of-type {
  background: #ffd987;
  font-style: italic;
  margin-bottom: 40px;
}

.tip {
  background: #fff;
  border: 1px solid #ccc;
  font-size: 1em;
  position: relative;
}

.tip:before {
  position: absolute;

  left: 98px;
  display: inline-block;
  border-right: 14px solid transparent;
  border-bottom: 14px solid #fff;
  border-left: 14px solid transparent;
  border-bottom-color: rgba(0, 0, 0, 0.2);
  content: "";
}

.tip:after {
  position: absolute;
  left: 99px;
  display: inline-block;
  border-right: 12px solid transparent;
  border-bottom: 12px solid #fff;
  border-left: 12px solid transparent;
  content: "";
}

.tip.left:before {
  border-top: 14px solid transparent;
  border-right: 14px solid #fff;
  border-bottom: 14px solid transparent;
  border-right-color: rgba(0, 0, 0, 0.2);
  left: -28px;
  top: 0;
}

.tip.left:after {
  border-top: 12px solid transparent;
  border-right: 12px solid #f5f8fa;
  border-bottom: 12px solid transparent;
  left: -24px;
  top: 2px;
}
.body {
  padding-left: 1em;
  padding-right: 1em;
}

.header {
  align-items: center;
  padding-right: 16px;
  padding-left: 16px;
  background-color: #f5f8fa;
  border-bottom: 1px solid lightgray;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
</style>