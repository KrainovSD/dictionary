<template>
  <info-popup ref="info" />
  <confirm-popup ref="confirm" />
  <category-popup
    v-if="categoryPopupVisible == true"
    categoryPopupType="add"
    @close="categoryPopupVisible = false"
  />
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

        <div class="wordPopup__inputContainer">
          <input-tooltip
            type="input"
            v-model="word"
            field="word"
            fontSize="16"
            :errors="errors"
            placeholder="*Word"
            @change="translateApi"
          />
        </div>
        <div class="wordPopup__inputContainer">
          <input-tooltip
            type="input"
            v-model="translate"
            field="translate"
            fontSize="16"
            :errors="errors"
            placeholder="*Translate"
          />
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
            @click="operationWithWord('add')"
            fontSize="14"
          />
        </div>
        <div
          class="newPassword__confirmContainer"
          v-if="wordPopupType == 'update'"
        >
          <confirm-button
            text="Редактировать слово"
            @click="operationWithWord('update')"
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

export default {
  components: {
    categoryPopup,
    inputTooltip,
    confirmButton,
    infoPopup,
    confirmPopup,
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
    };
  },
  mounted() {
    if (Object.keys(this.options)?.length != 0) {
      Object.keys(this.options).forEach((key) => {
        if (key == "transcription")
          this.$refs.transcription.value = this.options[key];
        this[key] = this.options[key];
        (async () => {
          if (key == "example") {
            let count = 1;
            this.options[key].forEach((example, index) => {
              if (index == 0) return;
              if (example.length > 0) count++;
            });
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
          }
        })();
      });
    }

    let input = Array.from(document.querySelectorAll("input"));
    let textArea = Array.from(document.querySelectorAll("textarea"));
    let inputs = [...input, ...textArea];

    inputs.forEach((input) => {
      input.addEventListener("focus", this.selectInput);
    });
    inputs.forEach((input) => {
      input.addEventListener("focusout", this.unSelectInput);
    });
    if (this.form) {
      Object.keys(this.form).forEach((field) => {
        console.log(field);
        this[field] = this.form[field];
      });
    }
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
        userInfo = this.getUserInfoFromLocalStorage();
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
  },
  methods: {
    getUserInfoFromLocalStorage() {
      try {
        let userInfo = {};
        let info = JSON.parse(localStorage.getItem("userInfo"));
        if (typeof info != "object" && info != null)
          throw new Error("Данные повреждены");
        if (info != null) userInfo = info;
        else {
          userInfo = {
            knownWords: [],
            wordsToStudy: [],
            wordsToRepeat: [],
            relevance: [],
            options: [
              {
                countKnownWordsAtOneTime: 50,
                countWrongsToAddToRepeat: 3,
                regularityToRepeat: [2, 2, 2, 4, 4, 4, 8, 8],
                maxDateCheckRelevance: 45,
                maxCountCheckRelevance: 3,
              },
            ],
            categoriesToLearn: [],
          };
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        return userInfo;
      } catch (err) {
        console.log(err);
        (async () => {
          await nextTick();
          this.showInfo(
            "Пользовательские данные",
            "Ваши локальные пользовательские данные были испорчены, всвязи с этим они были очищены!"
          );
        })();
        localStorage.clear();
        let userInfo = {
          knownWords: [],
          wordsToStudy: [],
          wordsToRepeat: [],
          relevance: [],
          options: [
            {
              countKnownWordsAtOneTime: 50,
              countWrongsToAddToRepeat: 3,
              regularityToRepeat: [2, 2, 2, 4, 4, 4, 8, 8],
              maxDateCheckRelevance: 45,
              maxCountCheckRelevance: 3,
            },
          ],
          categoriesToLearn: [],
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        return userInfo;
      }
    },
    async translateApi() {
      try {
        /*let response = await fetch(
          `https://speller.yandex.net/services/spellservice.json/checkText?text=${this.word}`
        );
        let result = await response.json();
        console.log(result);

        response = await fetch(
          `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20221129T170854Z.af9b2899afb4c061.7c5e69f9944a8a1b7f7b5c16916f21e54e6c34a9&lang=en-ru&text=${this.word}`
        );
        result = await response.json();
        console.log(result);*/
      } catch (err) {
        console.log(err);
      }
    },
    closePopup() {
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
      let id = `example${this.exampleCount - 1}`;
      console.log(id);
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
          (key == "word" || key == "translate" || key == "transcription")
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
          (field == "word" || field == "translate" || field == "transcription")
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
        if (type == "add") this.addWord(form);
        if (type == "update") this.updateWord(form);
      }
    },
    async addWord(form) {
      try {
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
          : this.$api.offWords.addWord(form);

        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        let message = res?.data?.message || res?.message;
        await this.showInfo("Добавление слова", message);

        this.closePopup();
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        this.showInfo("Добавление слова", message);
      }
    },
    async updateWord(form) {
      try {
        form.id = this.id;
        delete form.category;

        let res = this.$store.getters.getAuth
          ? await this.$api.words.updateWord(form)
          : this.$api.offWords.updateWord(form);

        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        let message = res?.data?.message || res?.message;
        await this.showInfo("Редактирование слова", message);
        this.closePopup();
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
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
