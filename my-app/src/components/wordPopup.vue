<template>
  <info-popup ref="info" />
  <loading-popup v-if="isLoading == true" />
  <confirm-popup ref="confirm" />
  <category-popup
    v-if="categoryPopupVisible == true"
    categoryPopupType="add"
    @close="categoryPopupVisible = false"
  />
  <div class="modal__backDrop" ref="backDrop"></div>
  <div class="modal__container info">
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
        <!-- CATEGORY -->
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
                @click="cЗуategoryPopupVisible = true"
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
        <!-- WORD -->
        <div class="wordPopup__inputContainer" style="position: relative">
          <input-tooltip
            type="input"
            v-model="word"
            fontSize="16"
            :error="errors?.word"
            placeholder="*Word"
            @keyup.enter="operationWithWord"
          />
          <translate-tooltip
            :word="word"
            :translate="translate"
            :transcription="transcription"
            :error="errors?.word"
            @changeTranslate="
              (item) => {
                this.translate =
                  this.translate.length > 0
                    ? `${this.translate}, ${item}`
                    : `${item}`;
              }
            "
            @changeTranscription="
              (item) => {
                this.transcription = item;
              }
            "
            @changeWord="
              (item) => {
                this.word = item;
              }
            "
            @changeAdviceWord="
              (item) => {
                this.adviceWord = item;
              }
            "
            @changeAdviceTranslate="
              (item) => {
                this.adviceTranslate = item;
              }
            "
            @changeAdviceTranscription="
              (item) => {
                this.adviceTranscription = item;
              }
            "
          />
        </div>
        <div
          class="wordPopup__adviceWord"
          v-if="adviceWord.length > 0 && this.word != this.adviceWord"
        >
          Возможно вы имели ввиду:
          <p @click="word = adviceWord">{{ adviceWord }}</p>
        </div>
        <!-- TRANSLATE -->
        <div class="wordPopup__inputContainer">
          <input-tooltip
            type="input"
            v-model="translate"
            fontSize="16"
            :error="errors?.translate"
            placeholder="*Translate"
            @keyup.enter="operationWithWord"
          />
        </div>
        <div
          class="wordPopup__adviceTranslate"
          v-if="adviceTranslate.length > 0 && adviceTranslateUsed != true"
        >
          Варианты перевода:
          <template v-for="(item, index) in adviceTranslate" :key="index">
            <p
              v-if="!translateList.includes(item)"
              @click="
                this.translate =
                  this.translate.length > 0
                    ? `${this.translate}, ${item}`
                    : `${item}`
              "
            >
              {{ item }}
            </p>
          </template>
        </div>

        <!-- TRANSCTIPTION -->

        <transcription-keyboard
          :error="errors?.transcription"
          :transcription="transcription"
          @changeTranscription="(payload) => (this.transcription = payload)"
        />

        <div
          class="wordPopup__adviceTranscription"
          v-if="
            adviceTranscription.length > 0 &&
            this.transcription != this.adviceTranscription
          "
        >
          Транскрипция:
          <p @click="transcription = adviceTranscription">
            {{ adviceTranscription }}
          </p>
        </div>
        <!-- DESCRIPTION -->
        <div class="wordPopup__textareaContainer">
          <input-tooltip
            type="textarea"
            maxLength="164"
            v-model="description"
            fontSize="16"
            :error="errors?.description"
            placeholder="Description"
          />
        </div>
        <!-- EXAMPLE -->
        <div
          class="wordPopup__inputContainer"
          style="position: relative"
          v-for="(item, index) in example"
          :key="index"
        >
          <input-tooltip
            type="input"
            v-model="example[index]"
            fontSize="16"
            :error="errors?.example?.[index]"
            placeholder="Example"
            @keyup.enter="operationWithWord"
            v-if="isShowExample(index)"
          />
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
import categoryPopup from "../components/categoryPopup.vue";
import inputTooltip from "../components/inputTooltip";
import confirmButton from "../components/confirmButton";
import infoPopup from "../components/infoPopup";
import confirmPopup from "../components/confirmPopup";
import closeModalButton from "../components/closeModalButton.vue";
import loadingPopup from "../components/loadingPopup.vue";
import transcriptionKeyboard from "../components/transcriptionKeyboard.vue";
import translateTooltip from "../components/translateTooltip.vue";

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
    translateTooltip,
  },
  emits: ["close"],
  props: {
    wordPopupType: String,
    options: Object,
  },
  data() {
    return {
      category: "",
      word: "",
      translate: "",
      transcription: "",
      description: "",
      example: ["", "", ""],
      id: "",
      errors: {},
      categoryPopupVisible: false,
      isLoading: false,
      adviceWord: "",
      adviceTranslate: [],
      adviceTranscription: "",
    };
  },
  mounted() {
    if (Object.keys(this.options)?.length != 0) {
      for (let key in this.options) {
        this[key] = this.options[key];
      }
    }
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
    isShowExample(index) {
      if (index == 0) {
        return true;
      }
      if (index == 1) {
        if (this.example[0].trim() != "") {
          return true;
        }
        this.repairEmptyField();
        return false;
      }
      if (index == 2) {
        if (this.example[0].trim() != "" && this.example[1].trim() != "") {
          return true;
        }
        this.repairEmptyField();
        return false;
      }
      return false;
    },
    repairEmptyField() {
      if (this.example[0].trim() == "") {
        if (this.example[1].trim() != "") {
          this.example[0] = this.example[1];
          this.example[1] = "";
        }
        if (this.example[2].trim() != "") {
          this.example[1] = this.example[2];
          this.example[2] = "";
        }
      } else if (this.example[1].trim() == "") {
        if (this.example[2].trim() != "") {
          this.example[1] = this.example[2];
          this.example[2] = "";
        }
      }
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
              /^[ɑaʌəεæɜʒıɪŋɔɒʃðθʤʊbdefghijklmnprʧstuvwz[\] ˌˈ:ː.()ɡ]+$/;
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
              !/^[а-яА-Яa-zA-Z0-9 \-.,!?']+$/.test(form[key]) &&
              form[key] != ""
            ) {
              this.errors[key] =
                "Описание слова или словочетания может состоять только из букв русского и английского алфавита, цифр, пробела, дефиса и знаков препинания!";
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
                !/^[a-zA-Z  \-.,!?']+$/.test(form[key][keyExample]) &&
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
              /^[ɑaʌəεæɜʒıɪŋɔɒʃðθʤʊbdefghijklmnprʧstuvwz[\] ˌˈ:ː.()ɡ]+$/;
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
              !/^[а-яА-Яa-zA-Z0-9 \-.,!?']+$/.test(fieldData) &&
              fieldData != ""
            ) {
              this.errors[field] =
                "Описание слова или словочетания может состоять только из букв русского и английского алфавита, цифр, пробела, дефиса и знаков препинания!";
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
                !/^[a-zA-Z  \-.,!?']+$/.test(fieldData[keyExample]) &&
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
        transcription: this.transcription,
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
        this.isLoading = true;

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
    transcription() {
      this.validateField("transcription", this.transcription);
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
