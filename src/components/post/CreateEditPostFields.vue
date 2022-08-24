<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ApolloError } from "@apollo/client/errors";
import CancelButton from "@/components/buttons/CancelButton.vue";
import SaveButton from "@/components/buttons/SaveButton.vue";
import TextEditor from "@/components/forms/TextEditor.vue";
import FormTitle from "@/components/forms/FormTitle.vue";
import FormRow from "@/components/forms/FormRow.vue";
import Form from "@/components/forms/Form.vue";
import TextInput from "@/components/forms/TextInput.vue";
import TagInput from "@/components/forms/TagInput.vue";
import PencilIcon from "@/components/icons/PencilIcon.vue";
import ErrorBanner from "@/components/forms/ErrorBanner.vue";
import TagIcon from "../icons/TagIcon.vue";
import AnnotationIcon from "../icons/AnnotationIcon.vue";
import { CreateEditPostFormValues } from "@/types/postTypes";

export default defineComponent({
  components: {
    CancelButton,
    ErrorBanner,
    TailwindForm: Form,
    FormRow,
    FormTitle,
    PencilIcon,
    SaveButton,
    TagIcon,
    TagInput,
    TextEditor,
    TextInput,
    AnnotationIcon,
  },
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
    return {
      touched: false,
    };
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
});
</script>

<template>
  <div>
    <div v-if="postLoading">Loading...</div>
    <div v-else-if="getPostError">
      <div v-for="(error, i) of getPostError?.graphQLErrors" :key="i">
        {{ error.message }}
      </div>
    </div>

    <TailwindForm
      v-else-if="!editMode || (editMode && formValues)"
      @input="touched = true"
    >
      <div class="divide-y divide-gray-200 sm:space-y-5 pr-8">
        <div>
          <FormRow>
            <template v-slot:content>
              <div class="flow-root">
                <FormTitle class="float-left"> {{ formTitle }} </FormTitle>
                <div class="float-right">
                  <CancelButton @click="$router.go(-1)" />
                  <SaveButton
                    @click.prevent="$emit('submit')"
                    :disabled="needsChanges"
                  />
                </div>
              </div>
            </template>
          </FormRow>

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
              <TagInput
                :selected-tags="formValues?.selectedTags"
                @setSelectedTags="
                  $emit('updateFormValues', { selectedTags: $event })
                "
              />
            </template>
          </FormRow>

          <FormRow>
            <template v-slot:icon>
              <AnnotationIcon class="float-right" />
            </template>
            <template v-slot:content>
              <TextEditor
                class="mb-3"
                :selected-tags="formValues.description || ''"
                @update="$emit('updateFormValues', { description: $event })"
              />
            </template>
          </FormRow>

          <FormRow>
            <template v-slot:content>
              <div class="pt-5">
                <div class="flex justify-end">
                  <CancelButton @click="$router.go(-1)" />
                  <SaveButton
                    @click.prevent="$emit('submit')"
                    :disabled="needsChanges"
                  />
                </div>
              </div>
            </template>
          </FormRow>
        </div>
      </div>
      <ErrorBanner v-if="needsChanges" :text="changesRequiredMessage" />
      <ErrorBanner v-if="createPostError" :text="createPostError.message" />
      <ErrorBanner v-if="updatePostError" :text="updatePostError.message" />
    </TailwindForm>
  </div>
</template>
<style>
</style>
