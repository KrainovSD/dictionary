<template>
  <div class="modal__backDrop" ref="backDrop">
    <div class="wordPopup">
      <img
        src="@/assets/close.png"
        alt=""
        class="sign__closeButton"
        @click.stop="closePopup"
      />
      <div class="sign__container">
        <h1 class="sign__header" v-if="wordPopupType == 'add'">Новое слово</h1>
        <h1 class="sign__header" v-else>Редактирование слова</h1>
        <p class="sign__description" v-if="wordPopupType == 'add'">
          Добавление нового слова в выбранную категорию
        </p>
        <p class="sign__description" v-else>
          Редактирование слова из выбранной категории
        </p>
        <!-- WORD -->
        <div style="position: relative">
          <input
            type="text"
            class="wordPopup__input"
            :class="errors.word ? '_error' : ''"
            placeholder="*Word"
            name="word"
            v-model="word"
            autocomplete="off"
          />
          <div
            class="wordPopup__tooltip"
            v-if="errors.word && currentFocusInput == 'word'"
            :tooltip="errors.word"
          ></div>
        </div>
        <!-- TRANSLATE -->
        <div style="position: relative">
          <input
            type="text"
            class="wordPopup__input"
            :class="errors.translate ? '_error' : ''"
            placeholder="*Translate"
            name="translate"
            v-model="translate"
            autocomplete="off"
          />
          <div
            class="wordPopup__tooltip"
            v-if="errors.translate && currentFocusInput == 'translate'"
            :tooltip="errors.translate"
          ></div>
        </div>
        <!-- TRANSCTIPTION -->
        <div style="position: relative">
          <div
            class="keyboard"
            v-if="currentFocusInput == 'transcription'"
            @mousedown="enterTranscription"
          >
            <div>
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
            </div>
            <div>
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
            </div>
            <div>
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
              <div class="keyboard__key space">←</div>
            </div>
          </div>
          <input
            type="text"
            class="wordPopup__input"
            :class="errors.transcription ? '_error' : ''"
            placeholder="*Transcription"
            name="transcription"
            @keypress.prevent=""
            @keyup="enterTranscription"
            autocomplete="off"
            ref="transcription"
          />
          <div
            class="wordPopup__tooltip"
            v-if="errors.transcription && currentFocusInput == 'transcription'"
            :tooltip="errors.transcription"
          ></div>
        </div>
        <!-- DESCRIPTION -->
        <div style="position: relative">
          <textarea
            type="text"
            class="wordPopup__input textArea"
            :class="errors.description ? '_error' : ''"
            placeholder="Description"
            name="description"
            maxlength="164"
            v-model="description"
            autocomplete="off"
          />
          <div
            class="wordPopup__tooltip"
            v-if="errors.description && currentFocusInput == 'description'"
            :tooltip="errors.description"
          ></div>
        </div>
        <!-- EXAMPLE -->
        <div
          style="position: relative"
          v-for="(item, index) in example"
          :key="index"
        >
          <img
            src="@/assets/plus.png"
            alt=""
            class="wordPopup__addExample"
            @click="addExample"
            v-if="exampleCount == index && exampleCount < 2"
          />
          <input
            type="text"
            class="wordPopup__input example"
            :class="errors?.example?.[index] ? '_error' : ''"
            placeholder="Example"
            :name="`example${index}`"
            autocomplete="off"
            v-model="example[index]"
            v-if="exampleCount >= index"
            :id="`example${index}`"
          />
          <div
            class="wordPopup__tooltip"
            v-if="
              errors?.example?.[index] && currentFocusInput == `example${index}`
            "
            :tooltip="errors?.example?.[index]"
          ></div>
        </div>
        <!-- CONFIRM BUTTON -->
        <button
          class="wordPopup__confirmButton"
          ref="confirmButton"
          @click.stop="operationWithWord('add')"
          v-if="wordPopupType == 'add'"
        >
          Добавить слово
        </button>
        <button
          class="wordPopup__confirmButton"
          ref="confirmButton"
          @click.stop="operationWithWord('update')"
          v-if="wordPopupType == 'update'"
        >
          Редактировать слово
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from "@vue/runtime-core";
export default {
  props: {
    wordPopupType: String,
  },
  data() {
    return {
      currentFocusInput: "",
      word: "",
      translate: "",
      transcription: "",
      description: "",
      example: ["", "", ""],
      image: "",
      errors: {},
      exampleCount: 0,
    };
  },
  mounted() {
    let input = Array.from(document.querySelectorAll("input"));
    let textArea = Array.from(document.querySelectorAll("textarea"));
    let inputs = [...input, ...textArea];

    inputs.forEach((input) => {
      input.addEventListener("focus", this.selectInput);
    });
    inputs.forEach((input) => {
      input.addEventListener("focusout", this.unSelectInput);
    });
  },
  beforeUnmount() {
    let input = Array.from(document.querySelectorAll("input"));
    let textArea = Array.from(document.querySelectorAll("textarea"));
    let inputs = [...input, ...textArea];
    inputs.forEach((input) => {
      input.removeEventListener("focus", this.selectInput);
    });
    inputs.forEach((input) => {
      input.removeEventListener("focusout", this.unSelectInput);
    });
  },
  methods: {
    closePopup() {
      if (!this.$refs.backDrop.classList.contains("close")) {
        this.$refs.backDrop.classList.toggle("close");
        setTimeout(() => {
          this.$refs.backDrop.classList.toggle("close");
          this.$emit("close");
        }, 300);
      }
    },
    selectInput(event) {
      let input = event.target;
      if (!input.classList.contains("_focus")) {
        input.classList.toggle("_focus");
        this.currentFocusInput = input.name;
      }
    },
    unSelectInput(event) {
      let input = event.target;
      if (input.classList.contains("_focus")) {
        input.classList.toggle("_focus");
        this.currentFocusInput = "";
      }
    },
    enterTranscription(event) {
      if (event.type == "keyup") {
        let input = this.$refs.transcription;
        this.validateField("transcription", input.value);
        return;
      }

      event.preventDefault();
      if (!event.target.classList.contains("keyboard__key")) return;
      let symbol = event.target.textContent;
      let input = this.$refs.transcription;
      let cursor = input.selectionStart;
      let text = input.value;
      switch (symbol) {
        case "_": {
          input.value =
            text.substring(0, cursor) + " " + text.substring(cursor);
          input.selectionStart = input.selectionEnd = cursor + 1;

          break;
        }
        case "←": {
          input.value = text.substring(0, cursor - 1) + text.substring(cursor);
          input.selectionStart = input.selectionEnd = cursor - 1;

          break;
        }
        default: {
          input.value =
            text.substring(0, cursor) + symbol + text.substring(cursor);
          input.selectionStart = input.selectionEnd = cursor + 1;

          break;
        }
      }
      this.validateField("transcription", input.value);
    },
    async addExample() {
      this.exampleCount += 1;
      await nextTick();
      let id = `example${this.exampleCount}`;
      let input = document.querySelector(`#${id}`);
      input.addEventListener("focus", this.selectInput);
      input.addEventListener("focusout", this.unSelectInput);
    },
    validateForm(form) {
      this.errors = {};
      Object.keys(form).forEach((key) => {
        if (
          form[key] == "" &&
          (key == "word" || key == "translate" || key == "transcription")
        ) {
          this.errors[key] = "Поле обязательно для заполнения!";
          return;
        }
        if (
          typeof form[key] !== "string" &&
          key != "example" &&
          form[key] != ""
        ) {
          this.errors[key] = "Неверный тип данных!";
          return;
        }
        switch (key) {
          case "word": {
            if (!/^[a-zA-Z\- ]+$/.test(form[key])) {
              this.errors[key] =
                "Слово или словосочетание может состоять только из букв английского алфавита, пробела и дефиса!";
              break;
            }
            if (form[key].length > 50) {
              this.errors[key] =
                "Длина слова или словосочетания не должна превышать более 50 символов!";
              break;
            }
            break;
          }
          case "translate": {
            if (!/^[а-яА-Я \-,]+$/.test(form[key])) {
              this.errors[key] =
                "Слово или словосочетание может состоять только из букв русского алфавита, пробела, дефиса или запятой!";
              break;
            }
            if (form[key].length > 50) {
              this.errors[key] =
                "Длина слова или словосочетания не должна превышать более 50 символов!";
              break;
            }
            break;
          }
          case "transcription": {
            let transcriptionRegExp =
              /^[ɑʌəεæɜʒıɪŋɔɒʃðθʤʊbdefghijklmnprʧstuvwz[\] ˌˈ:ː]+$/;
            if (!transcriptionRegExp.test(form[key])) {
              this.errors[key] =
                "Транскрипция может содержать только специальные символы представленные доп. клавиатурой!";
              break;
            }
            if (form[key].length > 50) {
              this.errors[key] =
                "Транскрипция не должна превышать более 50 символов!";
              break;
            }
            break;
          }
          case "description": {
            if (
              !/^[а-яА-Яa-zA-Z \-.,!?]+$/.test(form[key]) &&
              form[key] != ""
            ) {
              this.errors[key] =
                "Описание слова или словочетания может состоять только из букв русского и английского алфавита, пробела, дефиса и знаков препинания!";
              break;
            }
            if (form[key].length > 164) {
              this.errors[key] =
                "Длина описания слова или словосочетания не должна превышать более 164 символов!";
              break;
            }
            break;
          }
          case "example": {
            this.errors[key] = {};

            Object.keys(form[key]).forEach((keyExample) => {
              if (!form[key][keyExample] == "string") {
                this.errors[key][keyExample] = "Неверный тип данных!";
                return;
              }
              if (
                !/^[a-zA-Z  \-.,!?]+$/.test(form[key][keyExample]) &&
                form[key][keyExample] != ""
              ) {
                this.errors[key][keyExample] =
                  "Пример использования слова или словочетания может состоять только из букв английского алфавита, пробела, дефиса и знаков препинания!";
                return;
              }
              if (form[key][keyExample].length > 100) {
                this.errors[key][keyExample] =
                  "Длина примера использования слова или словосочетания не должна превышать более 100 символов!";
                return;
              }
            });

            if (Object.keys(this.errors[key]).length == 0)
              delete this.errors[key];
            break;
          }
        }
      });
    },
    validateField(field, fieldData) {
      if (this.errors[field]) {
        if (typeof fieldData !== "string" && field != "example") {
          this.errors[field] = "Неверный тип данных!";
          return;
        }
        if (
          fieldData == "" &&
          (field == "word" || field == "translate" || field == "transcription")
        ) {
          this.errors[field] = "Поле обязательно для заполнения!";
          return;
        }
        switch (field) {
          case "word": {
            if (!/^[a-zA-Z -]+$/.test(fieldData)) {
              this.errors[field] =
                "Слово или словосочетание может состоять только из букв английского алфавита, пробела и дефиса!";
              return;
            }
            if (fieldData.length > 50) {
              this.errors[field] =
                "Длина слова или словосочетания не должна превышать более 50 символов!";
              return;
            }
            break;
          }
          case "translate": {
            if (!/^[а-яА-Я \-,]+$/.test(fieldData)) {
              this.errors[field] =
                "Слово или словосочетание может состоять только из букв русского алфавита, пробела, дефиса и запятой!";
              return;
            }
            if (fieldData.length > 50) {
              this.errors[field] =
                "Длина слова или словосочетания не должна превышать более 50 символов!";
              return;
            }
            break;
          }
          case "transcription": {
            let transcriptionRegExp =
              /^[ɑʌəεæɜʒıɪŋɔɒʃðθʤʊbdefghijklmnprʧstuvwz[\] ˌˈ:ː]+$/;
            if (!transcriptionRegExp.test(fieldData)) {
              this.errors[field] =
                "Транскрипция может содержать только специальные символы представленные доп. клавиатурой!";
              return;
            }
            if (fieldData.length > 50) {
              this.errors[field] =
                "Транскрипция не должна превышать более 50 символов!";
              return;
            }
            break;
          }
          case "description": {
            if (
              !/^[а-яА-Яa-zA-Z \-.,!?]+$/.test(fieldData) &&
              fieldData != ""
            ) {
              this.errors[field] =
                "Описание слова или словочетания может состоять только из букв русского и английского алфавита, пробела, дефиса и знаков препинания!";
              return;
            }
            if (fieldData.length > 164) {
              this.errors[field] =
                "Длина описания слова или словосочетания не должна превышать более 164 символов!";
              return;
            }
            break;
          }
          case "example": {
            this.errors[field] = {};
            Object.keys(fieldData).forEach((keyExample) => {
              if (!fieldData[keyExample] == "string") {
                this.errors[field][keyExample] = "Неверный тип данных!";
                return;
              }
              if (
                !/^[a-zA-Z  \-.,!?]+$/.test(fieldData[keyExample]) &&
                fieldData[keyExample] != ""
              ) {
                this.errors[field][keyExample] =
                  "Пример использования слова или словочетания может состоять только из букв английского алфавита, пробела, дефиса и знаков препинания!";
                return;
              }
              if (fieldData[keyExample].length > 100) {
                this.errors[field][keyExample] =
                  "Длина примера использования слова или словосочетания не должна превышать более 100 символов!";
                return;
              }
            });

            break;
          }
        }
        if (
          field != "example" ||
          (Object.keys(this.errors?.example).length == 0 && field == "example")
        )
          delete this.errors[field];
      }
    },
    operationWithWord(type) {
      if (!this.$refs.confirmButton.classList.contains("_active")) {
        this.$refs.confirmButton.classList.toggle("_active");
      }

      let form = {
        word: this.word,
        translate: this.translate,
        transcription: this.$refs.transcription.value,
        description: this.description,
        example: this.example,
      };

      this.validateForm(form);
      if (Object.keys(this.errors).length === 0) {
        setTimeout(() => {
          this.$refs.confirmButton.classList.toggle("_active");
          this.$emit(type, form);
          //this.closePopup();
        }, 300);
      } else {
        console.log(this.errors);
        setTimeout(() => {
          this.$refs.confirmButton.classList.toggle("_active");
        }, 300);
      }
    },
  },
  watch: {
    word() {
      this.validateField("word", this.word);
    },
    translate() {
      this.validateField("translate", this.translate);
    },
    description() {
      this.validateField("description", this.description);
    },
    example: {
      handler: function () {
        this.validateField("example", this.example);
      },
      deep: true,
    },
  },
};
</script>

<style></style>
