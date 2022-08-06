<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import ListboxButton from "@/components/forms/ListboxButton.vue";
import {
  Listbox,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/solid";
import { SelectOptionData } from "@/types/genericFormTypes";

export default defineComponent({
  components: {
    CheckIcon,
    Listbox,
    ListboxLabel,
    ListboxOption,
    ListboxOptions,
    ListboxButton,
  },
  props: {
    selectLabel: {
      type: String,
      required: false,
    },
    selectedOption: {
      type: Object as PropType<SelectOptionData>,
      required: true,
    },
    options: {
      type: Array as PropType<Array<SelectOptionData>>,
      required: true,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const selected = ref(props.selectedOption);
    return {
      selected,
    };
  },
});
</script>

<template>
  <Listbox
    as="div"
    v-model="selected"
    @update:model-value="$emit('updateSelected', selected)"
  >
    <ListboxLabel
      v-if="selectLabel"
      class="block text-xs font-medium text-gray-700"
    >
      {{ selectLabel }}
    </ListboxLabel>
    <div :class="[fullWidth ? 'w-full' : 'w-40', 'relative']">
      <ListboxButton :label="`${selected.label}`" />
      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="
            absolute
            z-10
            mt-1
            w-full
            bg-white
            shadow-lg
            max-h-60
            rounded-md
            py-1
            text-base
            ring-1 ring-black ring-opacity-5
            overflow-auto
            focus:outline-none
            sm:text-sm
          "
        >
          <ListboxOption
            as="template"
            v-for="option in options"
            :key="option.label"
            :value="option"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                active ? 'text-white bg-blue-600' : 'text-gray-900',
                'cursor-default select-none relative py-2 pl-3 pr-9',
              ]"
            >
              <span
                :class="[
                  selected ? 'font-semibold' : 'font-normal',
                  'block truncate',
                ]"
              >
                {{ `${option.label}` }}
              </span>

              <span
                v-if="selected"
                :class="[
                  active ? 'text-white' : 'text-blue-600',
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                ]"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>