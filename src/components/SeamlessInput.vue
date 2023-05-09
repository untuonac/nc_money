<template>
  <div
    class="
      flex
      items-center

      w-full
      h-[36px]

      border-2
      border-solid
      border-transparent
      rounded-large

      hover:border-primary-element
      focus:border-primary-element
      disabled:text-text-maxcontrast disabled:hover:border-transparent
    "
  >
    <slot name="pre"></slot>
    <input
      class="
        my-0
        flex-grow
        w-full
        overflow-hidden text-ellipsis
        bg-inherit
        border-none
        border-0
      "
      type="text"
      :placeholder="placeholder + '...'"
      :disabled="disabled"
      v-model="inputValue"
      @change="handleValueChange"
      @focus="$event.target.select()"
    >
    <slot name="post"></slot>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    emits: [ 'value-changed' ],
    data() {
      return {
        inputValue: this.value
      };
    },
    watch: {
      value() {
        this.inputValue = this.value;
      }
    },
    methods: {
      handleValueChange() {
        const newValue = this.inputValue;
        this.inputValue = this.value;
        this.$emit('value-changed', newValue);
      }
    }
  });
</script>
