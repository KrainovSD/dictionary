<template>
  <div style="position: relative; width: 100%; height: 100%">
    <input
      type="text"
      spellcheck="false"
      class="interactiveInput__input"
      :class="[
        errors ? '_error' : '',
        focusInput == true ? '_focus' : '',
        interactiveClass,
      ]"
      :style="`font-size: ${fontSize}px`"
      :placeholder="placeholder"
      autocomplete="off"
      :value="inputValue"
      @focus="focusInput = true"
      @focusout="focusInput = false"
      @keydown="enterWord"
      readonly
      ref="input"
    />
    <div
      class="interactiveInput__tooltip"
      :class="tooltip == 'top' ? 'top' : ''"
      v-if="errors && focusInput == true"
      :tooltip="errors"
    ></div>
    <div class="interactiveInput__keyboard" @click="enterWord">
      <div class="interactiveInput__firstRow">
        <div class="interactiveInput__key">q</div>
        <div class="interactiveInput__key">w</div>
        <div class="interactiveInput__key">e</div>
        <div class="interactiveInput__key">r</div>
        <div class="interactiveInput__key">t</div>
        <div class="interactiveInput__key">y</div>
        <div class="interactiveInput__key">u</div>
        <div class="interactiveInput__key">i</div>
        <div class="interactiveInput__key">o</div>
        <div class="interactiveInput__key">p</div>
      </div>
      <div class="interactiveInput__secondRow">
        <div class="interactiveInput__key">a</div>
        <div class="interactiveInput__key">s</div>
        <div class="interactiveInput__key">d</div>
        <div class="interactiveInput__key">f</div>
        <div class="interactiveInput__key">g</div>
        <div class="interactiveInput__key">h</div>
        <div class="interactiveInput__key">j</div>
        <div class="interactiveInput__key">k</div>
        <div class="interactiveInput__key">l</div>
      </div>
      <div class="interactiveInput__thirdRow">
        <div class="interactiveInput__key">z</div>
        <div class="interactiveInput__key">x</div>
        <div class="interactiveInput__key">c</div>
        <div class="interactiveInput__key">v</div>
        <div class="interactiveInput__key">b</div>
        <div class="interactiveInput__key">n</div>
        <div class="interactiveInput__key">m</div>
        <div class="interactiveInput__key backspace">
          <img src="@/assets/backspace.png" alt="" />
        </div>
      </div>
      <div class="interactiveInput__fouthRow">
        <div class="interactiveInput__key">-</div>
        <div class="interactiveInput__key space"></div>
        <div class="interactiveInput__key enter">
          <img src="@/assets/enter.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["answer", "enterDown"],
  props: {
    answer: String,
    errors: String,
    placeholder: String,
    fontSize: String,
    tooltip: String,
    interactive: String,
    maxLength: String, // for textarea
  },
  data() {
    return {
      inputValue: "",
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
  methods: {
    enterWord(e) {
      if (e.type != "keydown" && e.type != "click") return;
      if (e.type == "keydown") {
        let letter = e.key;
        if (/^[a-zA-Z-]$/.test(letter)) {
          this.inputValue += letter;
          return;
        } else if (letter == "Backspace") {
          this.inputValue = this.inputValue.slice(
            0,
            this.inputValue.length - 1
          );
          return;
        }
      } else if (e.type == "click") {
        let target = e.target;
        if (!target.classList.contains("interactiveInput__key")) {
          if (!target.parentNode.classList.contains("interactiveInput__key"))
            return;
          target = target.parentNode;
        }
        if (target.classList.contains("space")) {
          this.inputValue += " ";
          return;
        } else if (target.classList.contains("backspace")) {
          this.inputValue = this.inputValue.slice(
            0,
            this.inputValue.length - 1
          );
          return;
        } else if (target.classList.contains("enter")) {
          this.$emit("enterDown");
          return;
        } else {
          let letter = target.textContent;
          if (/^[a-zA-Z-]$/.test(letter)) {
            this.inputValue += letter;
            return;
          }
        }
      }
    },
  },
  watch: {
    inputValue() {
      if (this.inputValue !== this.answer)
        this.$emit("answer", this.inputValue);
    },
    answer() {
      if (this.inputValue !== this.answer) {
        this.inputValue = this.answer;
      }
    },
  },
};
</script>

<style>
.interactiveInput__keyboard {
  position: fixed;
  width: 900px;
  z-index: 100;
  gap: 5px;
  flex-wrap: wrap;
  background-color: rgba(49, 49, 49, 0.726);
  padding: 10px 20px;
  left: 0;
  bottom: 0;
  display: grid;
  grid-template-rows: repeat(4, 40px);
  grid-template-columns: repeat(1, 1fr);
}

.interactiveInput__firstRow {
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(10, minmax(24px, 1fr));
}
.interactiveInput__secondRow {
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(9, minmax(24px, 1fr));
}
.interactiveInput__thirdRow {
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(8, minmax(24px, 1fr));
}
.interactiveInput__fouthRow {
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(3, minmax(24px, 1fr));
}
.interactiveInput__keyboard img {
  width: 22px;
  height: 22px;
}
.interactiveInput__key {
  background-color: white;
  color: black;
  font-size: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.interactiveInput__key.backspace {
  background-color: rgb(189, 189, 189);
}
.interactiveInput__key.space {
}
.interactiveInput__key.enter {
  background-color: rgb(189, 189, 189);
}
@media (max-width: 1023px) {
  .interactiveInput__keyboard {
    width: 100vw;
  }
}

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
  font-size: 16px;
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
@media (max-width: 767px) {
  .interactiveInput__tooltip {
    left: 50%;
    top: -10%;
  }
  .interactiveInput__tooltip::after {
    transform: translateX(-50%) translateY(-100%);
  }

  .interactiveInput__tooltip::before {
    transform: translatey(-50%) rotate(0deg);
  }
}
</style>
