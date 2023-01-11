<template>
  <div style="position: relative; width: 100%; height: 100%">
    <input
      type="text"
      class="interactiveInput__input"
      :class="[
        errors?.[field] ? '_error' : '',
        focusInput == true ? '_focus' : '',
        interactiveClass,
      ]"
      :style="`font-size: ${fontSize}px`"
      :placeholder="placeholder"
      :name="field"
      autocomplete="off"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="focusInput = true"
      @focusout="focusInput = false"
      v-if="type == 'input'"
      ref="input"
    />
    <textarea
      type="text"
      class="interactiveInput__input textarea"
      :class="[
        errors?.[field] ? '_error' : '',
        focusInput == true ? '_focus' : '',
      ]"
      :style="`font-size: ${fontSize}px;`"
      :placeholder="placeholder"
      :name="field"
      :maxlength="maxLength"
      autocomplete="off"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="focusInput = true"
      @focusout="focusInput = false"
      v-else
      ref="textarea"
    />
    <div
      class="interactiveInput__tooltip"
      :class="tooltip == 'top' ? 'top' : ''"
      v-if="errors?.[field] && focusInput == true"
      :tooltip="errors?.[field]"
    ></div>
  </div>
</template>

<script>
export default {
  emits: ["update:modelValue"],
  props: {
    modelValue: String,
    field: String,
    errors: Object,
    placeholder: String,
    fontSize: String,
    type: String,
    tooltip: String,
    interactive: String,
    maxLength: String, // for textarea
  },
  data() {
    return {
      focusInput: false,
    };
  },
  mounted() {
    let input = this.$refs?.input;
    let textarea = this.$refs?.textarea;
    if (!textarea) {
      input.focus();
    } else {
      textarea.focus();
    }
  },
  computed: {
    interactiveClass() {
      return `_${this.interactive}`;
    },
  },
};
</script>

<style>
.interactiveInput__input {
  display: flex;
  border-radius: 3px;
  box-shadow: 0px 0px 4px 0px #ffffff;
  background-color: white;
  border: 1px solid white;
  transition: all 0.3s ease;
  padding: 12px 10px;
  width: 100%;
}
.interactiveInput__input.textarea {
  resize: none;
  height: 100%;
}
.interactiveInput__input._focus {
  border-color: #66afe9;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
}
.interactiveInput__input._error {
  border-color: #e96666;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(233, 102, 102, 0.6);
}
.interactiveInput__input._correct {
  animation-name: clickButtonHeader;
  animation-duration: 0.5s;

  border-color: green;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(1, 85, 1, 0.568);
}
.interactiveInput__input._wrong {
  animation-name: shake;
  animation-duration: 0.5s;
  border-color: #e96666;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(233, 102, 102, 0.6);
}
.interactiveInput__input._between {
  animation-name: shake;
  animation-duration: 0.5s;
  border-color: yellow;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(202, 202, 3, 0.664);
}
.interactiveInput__tooltip {
  position: absolute;
  display: inline-block;
  left: 100%;
  top: 50%;
}
.interactiveInput__tooltip::after {
  content: attr(tooltip);
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: white;
  font-size: 1.2vw;
  min-width: 250px;
  border-radius: 5px;
  pointer-events: none;
  padding: 9px 9px;
  z-index: 99;
  left: 200%;
  top: 50%;
  margin-left: 8px;
  transform: translateX(0%) translateY(-50%);
}

.interactiveInput__tooltip::before {
  content: "";
  position: absolute;
  border-width: 4px 6px 0 6px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.7) transparent transparent transparent;
  z-index: 99;
  left: 100%;
  top: 50%;
  margin-left: 1px;
  transform: translatey(-50%) rotate(90deg);
}

.interactiveInput__tooltip.top {
  left: 50%;
  top: -10%;
}
.interactiveInput__tooltip.top::after {
  transform: translateX(-50%) translateY(-100%);
}
.interactiveInput__tooltip.top::before {
  transform: translatey(-50%) rotate(0deg);
}
</style>
