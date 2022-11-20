<template>
  <div class="setting__container">
    <p class="setting__userDataTittle">{{ title }}</p>
    <p class="setting__userData" v-if="fieldChangin == false">
      {{ data }}
    </p>
    <div style="position: relative">
      <input
        ref="input"
        type="text"
        class="setting__userDataInput"
        :class="[
          errors[field] ? '_error' : '',
          inputType == 'Number' ? 'number' : '',
        ]"
        :placeholder="placeholder"
        :name="field"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="focusInput = true"
        @focusout="focusInput = false"
        v-if="fieldChangin == true"
        autocomplete="off"
      />
      <div
        class="wordPopup__tooltip"
        v-if="errors?.[field] && focusInput == true"
        :tooltip="errors?.[field]"
      ></div>
    </div>
    <button
      class="setting__userDataReplace _change"
      v-if="fieldChangin == false"
      @click="openEditor"
    >
      Изменить
    </button>
    <img
      src="@/assets/closeRed.png"
      alt=""
      class="setting__userDataClose"
      v-if="fieldChangin == true"
      @click="fieldChangin = false"
    />
    <button
      class="setting__userDataReplace"
      v-if="fieldChangin == true"
      @click="$emit('change', { field: field, fieldData: this.modelValue })"
    >
      Сохранить
    </button>
  </div>
</template>

<script>
import { nextTick } from "@vue/runtime-core";
export default {
  emits: ["edit", "change", "close", "update:modelValue"],
  props: {
    modelValue: String,
    title: String,
    data: String,
    field: String,
    placeholder: String,
    errors: Object,
    inputType: String,
  },
  data() {
    return {
      focusInput: false,
      fieldChangin: false,
    };
  },
  computed: {
    fieldChange() {
      return `${this.field}Change`;
    },
  },
  methods: {
    forbiddenLetter(event) {
      let value = event.target.value;
      let key = event.key;
      if (!/^[0-9]$|^Backspace$/.test(key)) {
        event.preventDefault();
        return;
      }
      if (value.length >= 2 && key != "Backspace") {
        event.preventDefault();
        return;
      }
    },
    checkNumber(input) {
      if (this.inputType == "Number")
        input.addEventListener("keydown", this.forbiddenLetter);
    },
    async openEditor() {
      this.fieldChangin = true;
      await nextTick();
      let input = this.$refs.input;

      this.checkNumber(input);
      this.$emit("edit", this.field);
    },
  },
};
</script>

<style></style>
