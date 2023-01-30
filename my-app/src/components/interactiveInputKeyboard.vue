<template>
  <div class="interactiveInput__keyboard" @click="enterWord">
    <div class="interactiveInput__inputRow">
      <div class="interactiveInput__inputContainer">
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
          readonly
          ref="input"
        />
        <div
          class="interactiveInput__tooltip"
          v-if="errors && focusInput == true"
          :tooltip="errors"
        ></div>
      </div>
    </div>

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
</template>

<script>
export default {
  emits: ["answer", "enterDown"],
  props: {
    answer: String,
    errors: String,
    placeholder: String,
    fontSize: String,
    interactive: String,
  },
  data() {
    return {
      inputValue: "",
      focusInput: false,
    };
  },
  computed: {
    interactiveClass() {
      return `_${this.interactive}`;
    },
  },
  methods: {
    enterWord(e) {
      if (e.type != "click") return;
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
        this.inputValue = this.inputValue.slice(0, this.inputValue.length - 1);
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
  width: 1023px;
  z-index: 10;
  gap: 5px;
  flex-wrap: wrap;
  background-color: rgba(49, 49, 49, 0.726);
  padding: 10px 20px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  display: grid;
  grid-template-rows: repeat(5, 40px);
  grid-template-columns: repeat(1, 1fr);
}
.interactiveInput__inputRow {
  display: grid;
  grid-template-columns: repeat(10, minmax(24px, 1fr));
}
.interactiveInput__inputContainer {
  position: relative;
  height: 100%;
  grid-column: 4/8;
}
.interactiveInput__inputRow input {
  height: 100%;
  padding: 5px 5px;
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
  font-size: 28px;
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
</style>
