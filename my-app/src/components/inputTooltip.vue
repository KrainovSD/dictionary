<template>
  <div style="position: relative; width: 100%; height: 100%">
    <input
      type="text"
      class="inputTooltip__input"
      :class="[error ? '_error' : '', focusInput == true ? '_focus' : '']"
      :style="`font-size: ${fontSize}px`"
      :placeholder="placeholder"
      autocomplete="off"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="focusInput = true"
      @focusout="focusInput = false"
      v-if="type == 'input'"
    />
    <textarea
      type="text"
      class="inputTooltip__input textarea"
      :class="[error ? '_error' : '', focusInput == true ? '_focus' : '']"
      :style="`font-size: ${fontSize}px;`"
      :placeholder="placeholder"
      :maxlength="maxLength"
      autocomplete="off"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="focusInput = true"
      @focusout="focusInput = false"
      v-else
    />
    <div
      class="inputTooltip__tooltip"
      :class="tooltip == 'top' ? 'top' : ''"
      v-if="error && focusInput == true"
      :tooltip="error"
    ></div>
  </div>
</template>

<script>
export default {
  emits: ["update:modelValue"],
  props: {
    modelValue: String,
    error: String,
    placeholder: String,
    fontSize: String,
    type: String,
    tooltip: String,
    maxLength: String, // for textarea
  },
  data() {
    return {
      focusInput: false,
    };
  },
};
</script>

<style>
.inputTooltip__input {
  display: flex;
  border-radius: 3px;
  box-shadow: 0px 0px 4px 0px #ffffff;
  background-color: white;
  border: 1px solid white;
  transition: all 0.3s ease;
  padding: 12px 10px;
  width: 100%;
}
.inputTooltip__input.textarea {
  resize: none;
  height: 100%;
}
.inputTooltip__input._focus {
  border-color: #66afe9;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
}

.inputTooltip__input._error {
  border-color: #e96666;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(233, 102, 102, 0.6);
}
.inputTooltip__tooltip {
  position: absolute;
  display: inline-block;
  left: 50%;
  top: -10%;
}
.inputTooltip__tooltip::after {
  content: attr(tooltip);
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: white;
  font-size: 16px;
  min-width: 200px;
  border-radius: 5px;
  pointer-events: none;
  padding: 9px 9px;
  z-index: 99;
  left: 200%;
  top: 50%;
  margin-left: 8px;
  transform: translateX(-50%) translateY(-100%);
}

.inputTooltip__tooltip::before {
  content: "";
  position: absolute;
  border-width: 4px 6px 0 6px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.7) transparent transparent transparent;
  z-index: 99;
  left: 100%;
  top: 50%;
  margin-left: 1px;
  transform: translatey(-50%) rotate(0deg);
}

.inputTooltip__tooltip.top {
  left: 50%;
  top: -10%;
}
.inputTooltip__tooltip.top::after {
  transform: translateX(-50%) translateY(-100%);
}
.inputTooltip__tooltip.top::before {
  transform: translatey(-50%) rotate(0deg);
}
</style>
