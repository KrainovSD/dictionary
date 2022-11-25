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
        class="inputTooltip__tooltip"
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

<style>
.setting__userDataTittle {
  font-size: 14px;
  line-height: 1;
}
.setting__userData {
  font-size: 14px;
  margin-left: 5px;
  margin-right: 8px;
  line-height: 1;
}
.setting__userDataInput {
  border-radius: 3px;
  box-shadow: 0px 0px 4px 0px #ffffff;
  background-color: white;
  border: 1px solid white;
  position: relative;
  font-size: 14px;
  margin-left: 10px;
  width: 180px;
}
.setting__userDataInput._focus {
  border-color: #66afe9;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
}
.setting__userDataInput._error {
  border-color: #e96666;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(233, 102, 102, 0.6);
}

.setting__userDataInput.number {
  width: 25px;
}
.setting__userDataReplace {
  padding: 5px 13px;
  border-radius: 20px;
  font-size: 12px;
  background-color: #698afe;
  box-shadow: 0px 3px 13px 0px #c2cef0;
  color: white;
  font-family: antique;
  margin: auto 5px auto 0;
}
.setting__userDataReplace._change {
  margin: auto 5px auto auto;
}
.setting__userDataClose {
  width: 22px;
  height: 22px;
  cursor: pointer;
  margin: auto 5px auto auto;
}
</style>
