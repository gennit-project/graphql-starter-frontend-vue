<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { ApolloError } from "@apollo/client/errors";
import CancelButton from "@/components/buttons/CancelButton.vue";
import SaveButton from "@/components/buttons/SaveButton.vue";
import TextEditor from "@/components/forms/TextEditor.vue";
import FormTitle from "@/components/forms/FormTitle.vue";
import FormRow from "@/components/forms/FormRow.vue";
import Form from "@/components/forms/Form.vue";
import TextInput from "@/components/forms/TextInput.vue";
import TagPicker from "@/components/forms/TagPicker.vue";
import PencilIcon from "@/components/icons/PencilIcon.vue";
import ErrorBanner from "@/components/forms/ErrorBanner.vue";
import TagIcon from "../icons/TagIcon.vue";
import { TagData } from "@/types/tagTypes";
import { GET_TAGS } from "@/graphQLData/tag/queries";
import { useQuery } from "@vue/apollo-composable";
import { CreateEditPostFormValues } from "@/types/postTypes";

export default defineComponent({
  props: {
    createPostError: {
      type: Object as PropType<ApolloError | null>,
      default: () => {
        return null;
      },
    },
    editMode: {
      type: Boolean,
      required: true,
    },
    getPostError: {
      type: Object as PropType<ApolloError | null>,
      default: () => {
        return null;
      },
    },
    formValues: {
      type: Object as PropType<CreateEditPostFormValues>,
      required: false,
    },
    updatePostError: {
      type: Object as PropType<ApolloError | null>,
      default: () => {
        return null;
      },
    },
    postLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const {
      loading: tagsLoading,
      error: tagsError,
      result: tagsResult,
    } = useQuery(GET_TAGS);

    // We allow the user to select from all existing tags.
    const tagOptionLabels = computed(() => {
      if (!tagsResult.value || !tagsResult.value.tags) {
        return [];
      }
      return tagsResult.value.tags.map((tag: TagData) => tag.text);
    });

    return {
      tagsError,
      tagsLoading,
      tagOptionLabels,
      tagsResult,
      touched: false,
    };
  },

  components: {
    CancelButton,
    ErrorBanner,
    TailwindForm: Form,
    FormRow,
    FormTitle,
    PencilIcon,
    SaveButton,
    TagIcon,
    TagPicker,
    TextEditor,
    TextInput,
  },
  data(props) {
    return {
      formTitle: props.editMode ? "Edit Post" : "Create Post",
    };
  },
  computed: {
    needsChanges() {
      // We do these checks:
      // - Title is included
      // console.log("Debug changes required", {
      //   title: this.title,
      // });
      const needsChanges = this.formValues.title.length === 0;
      return needsChanges;
    },
    changesRequiredMessage() {
      if (!this.formValues.title) {
        return "A title is required.";
      }

      return "";
    },
  },
  methods: {
    setSelectedTags(tag: any) {
      this.$emit("setSelectedTags", tag);
      // console.log(post);
      // this.tagInputValue = tag.join(", ");
    },
  },
});
</script>

<template>
  <div>
    <div v-if="tagsLoading || postLoading">Loading...</div>
    <div v-else-if="getPostError">
      <div v-for="(error, i) of getPostError?.graphQLErrors" :key="i">
        {{ error.message }}
      </div>
    </div>
    <TailwindForm
      v-else-if="!editMode || (editMode && formValues)"
      @input="touched = true"
    >
      <div class="divide-y divide-gray-200 sm:space-y-5">
        <div>
          <FormTitle> {{ formTitle }} </FormTitle>
          <div>
            <FormRow>
              <template v-slot:icon>
                <PencilIcon class="float-right" />
              </template>
              <template v-slot:content>
                <TextInput
                  :value="formValues.title"
                  :full-width="true"
                  :placeholder="'Add title'"
                  @update="$emit('updateFormValues', { title: $event })"
                />
              </template>
            </FormRow>

            <FormRow>
              <template v-slot:icon>
                <TagIcon class="float-right" />
              </template>

              <template v-slot:content>
                <TextInput
                  :full-width="true"
                  :placeholder="'Add tag(s)'"
                  :value="'placeholder for a new TagInput component'"
                />
                <TagPicker
                  :tag-options="tagOptionLabels"
                  :initial-value="formValues.selectedTags"
                  @setSelectedTags="
                    $emit('updateFormValues', { selectedTags: $event })
                  "
                />
              </template>
            </FormRow>
            <FormRow>
              <template v-slot:icon>
                <i class="fa-solid fa-list float-right"></i>
              </template>
              <template v-slot:content>
                <TextEditor
                  class="mb-3"
                  :initial-value="formValues.description || ''"
                  @update="$emit('updateFormValues', { description: $event })"
                />
              </template>
            </FormRow>
          </div>
        </div>
      </div>
      <ErrorBanner v-if="needsChanges" :text="changesRequiredMessage" />
      <ErrorBanner v-if="createPostError" :text="createPostError.message" />
      <ErrorBanner v-if="updatePostError" :text="updatePostError.message" />
      <div class="pt-5">
        <div class="flex justify-end">
          <CancelButton @click="$emit('cancel')" />
          <SaveButton
            @click.prevent="$emit('submit')"
            :disabled="needsChanges"
          />
        </div>
      </div>
    </TailwindForm>
  </div>
</template>
<style>
</style>
