<template>
  <div class="keyboard" @mousedown="enterTranscription" v-if="isFocus">
    <div class="keyboard__key">ɑ</div>
    <div class="keyboard__key">ʌ</div>
    <div class="keyboard__key">ə</div>
    <div class="keyboard__key">ε</div>
    <div class="keyboard__key">æ</div>
    <div class="keyboard__key">ɜ</div>
    <div class="keyboard__key">ʒ</div>
    <div class="keyboard__key">ı</div>
    <div class="keyboard__key">ɪ</div>
    <div class="keyboard__key">ŋ</div>
    <div class="keyboard__key">ɔ</div>
    <div class="keyboard__key">ɒ</div>
    <div class="keyboard__key">ʃ</div>
    <div class="keyboard__key">ð</div>
    <div class="keyboard__key">θ</div>

    <div class="keyboard__key">ʤ</div>

    <div class="keyboard__key">ʊ</div>
    <div class="keyboard__key">b</div>
    <div class="keyboard__key">d</div>
    <div class="keyboard__key">e</div>
    <div class="keyboard__key">f</div>
    <div class="keyboard__key">g</div>
    <div class="keyboard__key">h</div>
    <div class="keyboard__key">i</div>
    <div class="keyboard__key">j</div>
    <div class="keyboard__key">k</div>
    <div class="keyboard__key">l</div>
    <div class="keyboard__key">m</div>
    <div class="keyboard__key">n</div>
    <div class="keyboard__key">p</div>
    <div class="keyboard__key">r</div>
    <div class="keyboard__key">ʧ</div>

    <div class="keyboard__key">s</div>
    <div class="keyboard__key">t</div>
    <div class="keyboard__key">u</div>
    <div class="keyboard__key">v</div>
    <div class="keyboard__key">w</div>
    <div class="keyboard__key">z</div>
    <div class="keyboard__key">[</div>
    <div class="keyboard__key space">_</div>
    <div class="keyboard__key">]</div>
    <div class="keyboard__key">ˌ</div>
    <div class="keyboard__key">ˈ</div>
    <div class="keyboard__key">:</div>
    <div class="keyboard__key">ː</div>
    <div class="keyboard__key spaceMobile">_</div>
    <div class="keyboard__key backspace">←</div>

    <div class="keyboard__key insert">
      <img src="@/assets/insert.png" alt="" class="keyboard__img" />
    </div>
    <div class="keyboard__key clear">
      <img src="@/assets/clear.png" alt="" class="keyboard__img" />
    </div>
  </div>
  <input
    readonly
    type="text"
    class="wordPopup__input"
    :class="[error ? '_error' : '', isFocus ? '_focus' : '']"
    placeholder="*Transcription"
    name="transcription"
    @focus="isFocus = true"
    @focusout="isFocus = false"
    @keypress.prevent=""
    @input="
      (e) => {
        $emit('changeTranscription', e.target.value);
      }
    "
    autocomplete="off"
    ref="transcription"
  />
  <div
    class="inputTooltip__tooltip"
    v-if="error && isFocus"
    :tooltip="error"
  ></div>
</template>

<script>
export default {
  emits: ["changeTranscription"],
  props: {
    error: String,
    transcription: String,
  },
  data() {
    return { isFocus: false };
  },
  methods: {
    async enterTranscription(event) {
      /*if (event?.type == "keyup") {
        let input = this.$refs.transcription;
        this.$emit("changeTranscription", input.value);
        return;
      }*/

      event.preventDefault();
      let target = event.target;
      if (!target.classList.contains("keyboard__key")) {
        if (target.parentNode.classList.contains("keyboard__key")) {
          target = target.parentNode;
        } else return;
      }
      let input = this.$refs.transcription;
      if (target.classList.contains("insert")) {
        let text = await navigator.clipboard.readText();
        if (typeof text == "string") input.value += text;
      } else if (target.classList.contains("clear")) {
        input.value = "";
      } else {
        let symbol = target.textContent;

        //let cursor = input.selectionStart;
        let text = input.value;
        switch (symbol) {
          case "_": {
            input.value = text + " ";
            /*input.value =
            text.substring(0, cursor) + " " + text.substring(cursor);
          input.selectionStart = input.selectionEnd = cursor + 1;*/

            break;
          }
          case "←": {
            input.value = text.substring(0, text.length - 1);
            /*input.value = text.substring(0, cursor - 1) + text.substring(cursor);
          input.selectionStart = input.selectionEnd = cursor - 1;*/

            break;
          }
          default: {
            input.value = text + symbol;
            /*input.value =
            text.substring(0, cursor) + symbol + text.substring(cursor);
          input.selectionStart = input.selectionEnd = cursor + 1;*/

            break;
          }
        }
      }

      this.$emit("changeTranscription", input.value);
    },
  },
  watch: {
    transcription() {
      if (this.transcription != this.$refs.transcription.value) {
        this.$refs.transcription.value = this.transcription;
        return;
      }
    },
  },
};
</script>

<style>
.keyboard {
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 905px;
  z-index: 2;
  background-color: #e7fcf5;
  margin: 20px auto auto auto;
  background: rgba(112, 110, 110, 0.452);
  padding: 10px 10px 5px 10px;
  display: grid;
  gap: 0px 5px;
  grid-template-columns: repeat(16, 50px);
  grid-auto-rows: 50px;
}

.keyboard__key {
  display: flex;
  background-color: white;
  border-radius: 10px;
  font-size: 22px;
  cursor: pointer;
  align-items: center;
  border: 1px solid #034981;
  justify-content: center;
}
.keyboard__key:hover {
  border-color: #1b8ce9;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 174, 233, 0.836);
}
.keyboard__key.space {
  grid-column: 8/10;
}
.keyboard__key.backspace {
  grid-column: 15/17;
}
.keyboard__key.spaceMobile {
  display: none;
}
.keyboard__key.backspace {
  grid-column: 15/17;
}
.keyboard__key.insert {
  grid-column: 4/7;
}
.keyboard__key.clear {
  grid-column: 11/14;
}

.keyboard__img {
  width: 22px;
  height: 22px;
}

@media (max-width: 1023px) {
  .keyboard {
    position: fixed;
    top: 0px;
    left: 50%;
    bottom: auto;
    transform: translateX(-50%);
    background-color: #e7fcf5;
    background: rgb(99, 98, 98);
    margin: 0;
    width: 100vw;
    grid-template-columns: repeat(16, minmax(40px, 1fr));
    grid-template-rows: repeat(4, 40px);
    gap: 5px;
  }
}
@media (max-width: 767px) {
  .keyboard {
    grid-template-columns: repeat(16, minmax(26px, 1fr));
    grid-template-rows: repeat(4, 40px);
    gap: 5px 2.5px;
  }
}

@media (max-width: 479px) {
  .keyboard {
    display: flex;
    flex-wrap: wrap;
    width: 100vw;
    justify-content: center;
  }
  .keyboard__key.space {
    display: none;
  }
  .keyboard__key.backspace {
    flex-basis: calc(12.5% * 2 - 5px);
  }
  .keyboard__key.spaceMobile {
    display: grid;
    flex-basis: calc(12.5% * 2 - 5px);
  }
  .keyboard__key {
    font-size: 20px;
    margin-right: 2.5px;
    margin-bottom: 2.5px;
    height: 32px;
    flex-basis: calc(12.5% - 5px);
  }
  .keyboard__key.insert {
    flex-basis: calc(12.5% * 2 - 5px);
  }
  .keyboard__key.clear {
    flex-basis: calc(12.5% * 2 - 5px);
  }
}
</style>
