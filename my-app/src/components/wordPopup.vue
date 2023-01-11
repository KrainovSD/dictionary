<template>
  <info-popup ref="info" />
  <loading-popup v-if="isLoading == true" />
  <confirm-popup ref="confirm" />
  <category-popup
    v-if="categoryPopupVisible == true"
    categoryPopupType="add"
    @close="categoryPopupVisible = false"
  />
  <div class="modal__backDrop" ref="backDrop">
    <div class="wordPopup">
      <close-modal-button @close="closePopup" class="sign__closeButton" />
      <div class="sign__container">
        <h1 class="sign__header" v-if="wordPopupType == 'add'">Новое слово</h1>
        <h1 class="sign__header" v-else>Редактирование слова</h1>
        <p class="sign__description" v-if="wordPopupType == 'add'">
          Добавление нового слова в выбранную категорию
        </p>
        <p class="sign__description" v-else>
          Редактирование слова из выбранной категории
        </p>

        <div
          class="wordPopup__containerCategory"
          ref="category"
          v-if="wordPopupType == 'add'"
        >
          <div
            class="wordPopup__category"
            @click.self="showSubCategory"
            :class="errors.category ? '_error' : ''"
          >
            {{ categoryTitle }}
            <div class="wordPopup__subCategory _close" ref="subCategory">
              <div
                class="wordPopup__addCategory wordPopup__categoryItem"
                @click="categoryPopupVisible = true"
              >
                <p>Добавить категорию</p>
                <img
                  src="@/assets/pluss.png"
                  alt=""
                  class="wordPopup__addCategoryImg"
                />
              </div>
              <p
                class="wordPopup__categoryItem"
                v-for="(item, index) in categoryList"
                :key="index"
                :id="index"
                @click="
                  category = index;
                  showSubCategory();
                  validateField('category', category);
                "
              >
                {{ item }}
              </p>
            </div>
          </div>
          <img
            src="@/assets/arrowDown.png"
            alt=""
            class="wordPopup__arrow"
            @click="showSubCategory"
            id="arrow"
            ref="arrow"
          />
        </div>

        <div class="wordPopup__inputContainer" style="position: relative">
          <input-tooltip
            type="input"
            v-model="word"
            field="word"
            fontSize="16"
            :errors="errors"
            placeholder="*Word"
            @input="translateApi"
            @keyup.enter="operationWithWord"
          />
          <div
            class="wordPopup__tooltipAdvice"
            v-if="
              !errors?.word &&
              ((adviceWord.length > 0 && this.word != this.adviceWord) ||
                (adviceTranscription.length > 0 &&
                  this.transcription != this.adviceTranscription) ||
                (adviceTranslate.length > 0 && adviceTranslateUsed != true))
            "
          >
            <div
              class="wordPopup__adviceWordContainer"
              v-if="adviceWord.length > 0 && this.word != this.adviceWord"
            >
              <p>Возможно вы имели ввиду:</p>

              <div
                @click="
                  this.word = this.adviceWord;
                  this.translateApi();
                "
                class="wordPopup__adviceWord"
              >
                {{ adviceWord }}
              </div>
            </div>
            <div
              class="wordPopup__adviceTranscriptionContainer"
              v-if="
                adviceTranscription.length > 0 &&
                this.transcription != this.adviceTranscription
              "
            >
              <p>Транскрипция:</p>

              <div
                class="wordPopup__adviceTranscription"
                @click="
                  this.$refs.transcription.value = this.adviceTranscription;
                  this.transcription = this.adviceTranscription;
                "
              >
                {{ adviceTranscription }}
              </div>
            </div>
            <div
              class="wordPopup__adviceTranslateContainer"
              v-if="adviceTranslate.length > 0 && adviceTranslateUsed != true"
            >
              <p>Варианты перевода:</p>

              <template v-for="(item, index) in adviceTranslate" :key="index">
                <div
                  class="wordPopup__adviceTranslate"
                  v-if="!translateList.includes(item)"
                  @click="
                    this.translate =
                      this.translate.length > 0
                        ? `${this.translate}, ${item}`
                        : `${item}`
                  "
                >
                  {{ item }}
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="wordPopup__inputContainer">
          <input-tooltip
            type="input"
            v-model="translate"
            field="translate"
            fontSize="16"
            :errors="errors"
            placeholder="*Translate"
            @keyup.enter="operationWithWord"
          />
        </div>

        <!-- TRANSCTIPTION -->
        <div style="position: relative">
          <transcription-keyboard
            v-if="currentFocusInput == 'transcription'"
            @enterKey="(payload) => enterTranscription(payload)"
          />
          <input
            type="text"
            class="wordPopup__input"
            :class="errors.transcription ? '_error' : ''"
            placeholder="*Transcription"
            name="transcription"
            @keypress.prevent=""
            @keyup="enterTranscription"
            @input="
              (e) => {
                this.transcription = e.target.value;
              }
            "
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
        <div class="wordPopup__textareaContainer">
          <input-tooltip
            type="textarea"
            maxLength="164"
            v-model="description"
            field="description"
            fontSize="16"
            :errors="errors"
            placeholder="Description"
          />
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
            v-if="exampleCount - 1 == index && exampleCount < 3"
          />
          <input
            type="text"
            class="wordPopup__input example"
            :class="errors?.example?.[index] ? '_error' : ''"
            placeholder="Example"
            :name="`example${index}`"
            autocomplete="off"
            v-model="example[index]"
            v-if="exampleCount - 1 >= index"
            :id="`example${index}`"
            @keyup.enter="operationWithWord"
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
        <div
          class="newPassword__confirmContainer"
          v-if="wordPopupType == 'add'"
        >
          <confirm-button
            text="Добавить слово"
            @click="operationWithWord"
            fontSize="14"
          />
        </div>
        <div
          class="newPassword__confirmContainer"
          v-if="wordPopupType == 'update'"
        >
          <confirm-button
            text="Редактировать слово"
            @click="operationWithWord"
            fontSize="14"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from "@vue/runtime-core";
import categoryPopup from "../components/categoryPopup.vue";
import inputTooltip from "../components/inputTooltip";
import confirmButton from "../components/confirmButton";
import infoPopup from "../components/infoPopup";
import confirmPopup from "../components/confirmPopup";
import closeModalButton from "../components/closeModalButton.vue";
import loadingPopup from "../components/loadingPopup.vue";
import transcriptionKeyboard from "../components/transcriptionKeyboard.vue";

export default {
  components: {
    categoryPopup,
    inputTooltip,
    confirmButton,
    infoPopup,
    confirmPopup,
    closeModalButton,
    loadingPopup,
    transcriptionKeyboard,
  },
  emits: ["close"],
  props: {
    wordPopupType: String,
    options: Object,
  },
  data() {
    return {
      currentFocusInput: "",
      category: "",
      word: "",
      translate: "",
      transcription: "",
      description: "",
      example: ["", "", ""],
      id: "",
      errors: {},
      exampleCount: 1,
      categoryPopupVisible: false,
      isLoading: false,
      adviceWord: "",
      adviceTranslate: [],
      adviceTranscription: "",
    };
  },
  timerAPIController: null,
  delayAPI: 2000,
  mounted() {
    if (Object.keys(this.options)?.length != 0) {
      for (let key in this.options) {
        if (key == "example") {
          (async () => {
            let examplesOption = this.options.example;
            while (examplesOption.length < 3) examplesOption.push("");
            this[key] = examplesOption;
            let count = 1;
            for (let index in examplesOption) {
              let example = examplesOption[index];
              if (index == 0) continue;
              if (example.length > 0) count++;
            }
            this.exampleCount = count;
            await nextTick();
            if (count > 1) {
              for (let i = 2; i <= count; i++) {
                let id = `example${i - 1}`;
                let input = document.querySelector(`#${id}`);
                input.addEventListener("focus", this.selectInput);
                input.addEventListener("focusout", this.unSelectInput);
              }
            }
          })();
          continue;
        }
        if (key == "transcription")
          this.$refs.transcription.value = this.options[key];
        this[key] = this.options[key];
      }
    }
    if (this.word.length > 0) this.translateApi();

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
  computed: {
    userInfo() {
      let userInfo = this.$store.getters.getUserInfo;
      if (Object.keys(userInfo)?.length == 0) {
        userInfo = this.$api.offline.getUserInfo();
      }
      return userInfo;
    },
    categoryList() {
      let categoryList = {};
      let categories = this.userInfo;
      categories = categories?.categoriesToLearn;
      if (!categories || categories?.length == 0) return categoryList;
      categories = categories.filter(
        (category) => category.startLearn == false
      );
      if (categories?.length == 0) return categoryList;
      categories.forEach((category) => {
        categoryList[category._id] = category.name;
      });
      return categoryList;
    },
    categoryTitle() {
      if (this.category == "") return "Выберите категорию";
      return this.categoryList[this.category];
    },
    translateList() {
      let translateList = this.translate.split(",");
      translateList = translateList.filter((item) => item.trim() != "");
      translateList = translateList.map((item) => item.trim());
      return translateList;
    },
    adviceTranslateUsed() {
      if (this.adviceTranslate.length == 0) return true;
      let flag = true;
      for (let item of this.adviceTranslate) {
        if (this.translateList.includes(item)) continue;
        flag = false;
      }
      return flag;
    },
  },
  methods: {
    async translateApi() {
      clearTimeout(this.$options.timerAPIController);
      this.$options.timerAPIController = setTimeout(async () => {
        try {
          let res = await this.$api.words.translateAPI(
            this.word.toLowerCase().trim()
          );
          let { adviceWord, adviceTranslate, adviceTranscription } = res;
          this.adviceWord = adviceWord.length > 0 ? adviceWord : "";
          this.adviceTranscription =
            adviceTranscription.length > 0 ? adviceTranscription : "";
          this.adviceTranslate =
            adviceTranslate.length > 0 ? adviceTranslate : [];
        } catch (err) {
          this.adviceWord = "";
          this.adviceTranscription = "";
          this.adviceTranslate = [];
          console.log(err);
        }
      }, this.$options.delayAPI);
    },
    closePopup() {
      if (this.categoryPopupVisible == true) return;
      if (!this.$refs.backDrop.classList.contains("close")) {
        this.$refs.backDrop.classList.toggle("close");
        setTimeout(() => {
          this.$refs.backDrop.classList.toggle("close");
          this.$emit("close");
        }, 300);
      }
    },
    showSubCategory() {
      let subCategory = this.$refs.subCategory;
      let arrow = this.$refs.arrow;

      if (!subCategory?.classList?.contains("_close")) {
        subCategory.classList.toggle("_close");
        arrow.classList.toggle("_active");
        return;
      }
      subCategory.classList.toggle("_close");
      arrow.classList.toggle("_active");
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
      if (event?.type == "keyup") {
        let input = this.$refs.transcription;
        this.validateField("transcription", input.value);
        return;
      }

      let symbol = event;
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
      this.transcription = input.value;
      this.validateField("transcription", input.value);
    },
    async addExample() {
      this.exampleCount += 1;

      await nextTick();
      let id = `example${this.exampleCount - 1}`;
      let input = document.querySelector(`#${id}`);
      input.addEventListener("focus", this.selectInput);
      input.addEventListener("focusout", this.unSelectInput);
    },
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
    },
    async showConfirm(header, title) {
      let res = await this.$refs.confirm.show(header, title);
      return res;
    },
    validateForm(form) {
      this.errors = {};
      Object.keys(form).forEach((key) => {
        if (
          form[key] == "" &&
          (key == "word" ||
            key == "translate" ||
            key == "transcription" ||
            key == "description")
        ) {
          this.errors[key] = "Поле обязательно для заполнения!";
          return;
        }
        if (
          typeof form[key] !== "string" &&
          key != "example" &&
          form[key] != "" &&
          key != "category"
        ) {
          this.errors[key] = "Неверный тип данных!";
          return;
        }
        switch (key) {
          case "category": {
            if (form[key] == "") {
              this.errors[key] = "Выберите категорию!";
              return;
            }
            break;
          }
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
              /^[ɑaʌəεæɜʒıɪŋɔɒʃðθʤʊbdefghijklmnprʧstuvwz[\] ˌˈ:ː]+$/;
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
        if (
          typeof fieldData !== "string" &&
          field != "example" &&
          field != "category"
        ) {
          this.errors[field] = "Неверный тип данных!";
          return;
        }
        if (
          fieldData == "" &&
          (field == "word" ||
            field == "translate" ||
            field == "transcription" ||
            field == "description")
        ) {
          this.errors[field] = "Поле обязательно для заполнения!";
          return;
        }
        switch (field) {
          case "category": {
            if (fieldData == "") {
              this.errors[field] = "Выберите категорию!";
              return;
            }
            break;
          }
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
              /^[ɑaʌəεæɜʒıɪŋɔɒʃðθʤʊbdefghijklmnprʧstuvwz[\] ˌˈ:ː]+$/;
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
    operationWithWord() {
      let form = {
        category: this.category,
        word: this.word,
        translate: this.translate,
        transcription: this.$refs.transcription.value,
        description: this.description,
        example: this.example,
      };

      this.validateForm(form);
      if (Object.keys(this.errors).length === 0) {
        if (this.wordPopupType == "add") this.addWord(form);
        if (this.wordPopupType == "update") this.updateWord(form);
      }
    },
    async addWord(form) {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;

        let hasRelevance = this.userInfo?.relevance.filter((relevanceItem) => {
          if (relevanceItem.irregularVerb == false)
            return (
              relevanceItem.word == form.word &&
              relevanceItem?.offline != "delete"
            );
          let irregularVerbs = relevanceItem.word.split("--");
          irregularVerbs = irregularVerbs.map((item) =>
            item.toLowerCase().trim()
          );
          return (
            irregularVerbs.includes(form.word) &&
            relevanceItem?.offline != "delete"
          );
        });
        if (hasRelevance?.length != 0) {
          let confirm = await this.showConfirm(
            "Добавление слова",
            "Такое слово находится в Актуализаторе и при добавлении будет удалено из него. Продолжить операцию?"
          );
          if (!confirm) return;
        }

        let res = this.$store.getters.getAuth
          ? await this.$api.words.addWord(form)
          : this.$api.offline.addWord(form);

        this.isLoading = false;
        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          this.$api.offline.setSignatureAPI(userInfo);
        }
        let message = res?.data?.message || res?.message;
        await this.showInfo("Добавление слова", message);

        this.closePopup();
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        let status = err?.response?.status;
        this.isLoading = false;
        if (status == 0 || status == 500) {
          message =
            "Сервер не отвечает или интернет соединение утеряно, переводим операции в режим оффлайн, выполните операцию повторно!";
          this.$store.commit("resetAuth");
        }
        this.showInfo("Добавление слова", message);
      }
    },
    async updateWord(form) {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;

        form.id = this.id;
        delete form.category;

        let res = this.$store.getters.getAuth
          ? await this.$api.words.updateWord(form)
          : this.$api.offline.updateWord(form);

        this.isLoading = false;
        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          this.$api.offline.setSignatureAPI(userInfo);
        }
        let message = res?.data?.message || res?.message;
        await this.showInfo("Редактирование слова", message);
        this.closePopup();
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        let status = err?.response?.status;
        this.isLoading = false;
        if (status == 0 || status == 500) {
          message =
            "Сервер не отвечает или интернет соединение утеряно, переводим операции в режим оффлайн, выполните операцию повторно!";
          this.$store.commit("resetAuth");
        }
        this.showInfo("Редактирование слова", message);
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
