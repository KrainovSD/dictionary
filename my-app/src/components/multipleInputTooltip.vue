<template>
  <div style="position: relative; width: 100%; height: 100%">
    <input
      type="text"
      style="text-align: center"
      :style="`font-size: ${fontSize}px`"
      class="inputTooltip__input"
      :class="[
        errors?.[field]?.[index] ? '_error' : '',
        focusInput == true ? '_focus' : '',
      ]"
      :name="`${field}_${index}`"
      autocomplete="off"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup.enter="$emit('onEnter')"
      @keyup.esc="$emit('onEsc')"
      @focus="focusInput = true"
      @focusout="focusInput = false"
      @keydown="enterNumber"
    />

    <div
      class="inputTooltip__tooltip"
      v-if="errors?.[field]?.[index] && focusInput == true"
      :tooltip="errors?.[field]?.[index]"
    ></div>
  </div>
</template>

<script>
export default {
  emits: ["update:modelValue", "onEnter", "onEsc"],
  props: {
    modelValue: String,
    field: String,
    errors: Object,
    index: Number,
    fontSize: String,
  },
  data() {
    return {
      focusInput: false,
    };
  },
  computed: {
    styleFontSize() {
      return { "font-size": `${this.fontSize}px` };
    },
  },
  methods: {
    enterNumber(event) {
      if (!/^Backspace$|\d/.test(event.key)) {
        event.preventDefault();
      }
      if (event.target.value.length >= 2 && event.key != "Backspace") {
        event.preventDefault();
      }
    },
  },
};
</script>

<style></style>
