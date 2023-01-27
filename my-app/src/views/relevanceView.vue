<template>
  <word-popup
    v-if="wordPopupVisible == true"
    @close="wordPopupVisible = false"
    wordPopupType="add"
    :options="{ word: currentSelectedWord?.word }"
  />
  <info-popup ref="info" />
  <confirm-popup ref="confirm" />
  <loading-popup v-if="isLoading == true" />

  <div class="relevance appearVision">
    <div class="relevance__inputData">
      <div class="relevance__inputContainer">
        <input-tooltip
          type="textarea"
          maxLength="210"
          v-model="input"
          fontSize="16"
          :error="errors?.input"
          placeholder="Внесите слова"
        />
      </div>

      <button class="relevance__confirmInput" @click="checkInput">
        Внести
      </button>
      <p class="relevance__info">
        Для записи слов и дальнейшей проверке на актуальность, внесите слово или
        слова, используя в качестве разделителя знак запятой или точки с
        запятой, в текстовое поле. <br />
        С правой стороны экрана слова выводятся с количеством встреч в течении
        месяца (первая цифра) и с общим количеством встреч с этим словом с
        момента записи слова (цифра в скобках). Так же в квадратных скобках
        буквой " I " помечаются неправильные глаголы.<br />
        Слова имеют три цвета при добавлении: зеленый - новое слово, черный -
        количество встреч не превысило минимум, красное - часто встречающееся
        вам слово.<br />
        Чтобы добавить слово, которое часто вам встречается, в любую категорию
        для дальнейшего изучения, выберите подходящее слово в окошке справа.
      </p>
      <div class="relevance__CRUDcontainer">
        <button
          class="relevance__CRUD"
          @click="wordPopupVisible = true"
          :class="
            currentSelectedWord.countMeetsPerDays >=
            userInfo?.options?.[0]?.maxCountCheckRelevance
              ? ''
              : 'disabled'
          "
          :disabled="
            currentSelectedWord.countMeetsPerDays >=
            userInfo?.options?.[0]?.maxCountCheckRelevance
              ? false
              : true
          "
        >
          Добавить слово на изучение
        </button>
        <button
          class="relevance__CRUD"
          @click="deleteWord"
          :class="Object.keys(currentSelectedWord).length > 0 ? '' : 'disabled'"
          :disabled="Object.keys(currentSelectedWord).length > 0 ? false : true"
        >
          Удалить слово из хранилища
        </button>
      </div>
    </div>

    <div class="relevance__outputData">
      <div class="relevance__newInput">
        <p
          class="relevance__inputItem"
          v-for="(item, index) in currentAddedWords"
          :key="index"
          :class="[
            item?.totalCountMeets == 1 ? 'green' : '',
            item?.countMeetsPerDays >=
            userInfo?.options?.[0]?.maxCountCheckRelevance
              ? 'red'
              : '',
          ]"
        >
          {{ item.word }} - {{ item.countMeetsPerDays }} ({{
            item.totalCountMeets
          }})
        </p>
      </div>

      <div class="relevance__filterPanel">
        <div class="relevance__filterContainer">
          <slide-filter
            :filterList="filterList"
            @change="(payload) => (filter = payload)"
          />
        </div>
        <div class="relevance__searchContainer">
          <search-panel v-model="search" />
        </div>
      </div>

      <div class="relevance__list" @click.self="currentSelectedWord = []">
        <p
          class="relevance__word"
          :class="[
            item?.countMeetsPerDays >=
            userInfo?.options?.[0]?.maxCountCheckRelevance
              ? 'red'
              : '',
            currentSelectedWord?._id == item?._id ? '_select' : '',
          ]"
          :id="item._id"
          v-for="(item, index) in wordsList"
          :key="index"
          @click="
            currentSelectedWord =
              currentSelectedWord?._id == item?._id ? [] : item
          "
        >
          {{ item.word }} - {{ item.countMeetsPerDays }} ({{
            item.totalCountMeets
          }})
          <span v-if="item.irregularVerb == true">[I]</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import wordPopup from "../components/wordPopup.vue";
import slideFilter from "../components/slideFilter.vue";
import searchPanel from "../components/searchPanel.vue";
import inputTooltip from "../components/inputTooltip.vue";
import infoPopup from "../components/infoPopup.vue";
import confirmPopup from "../components/confirmPopup.vue";
import loadingPopup from "../components/loadingPopup.vue";
export default {
  components: {
    wordPopup,
    slideFilter,
    searchPanel,
    inputTooltip,
    infoPopup,
    confirmPopup,
    loadingPopup,
  },
  data() {
    return {
      input: "",
      errors: {},
      search: "",
      filter: "letterUp",
      filterList: {
        letterUp: "По алфавиту от A до Z",
        letterDown: "По алфавиту от Z до A",
        countPerMonthUp: "По количеству встреч за месяц (по возрастанию)",
        countPerMonthDown: "По количеству встреч за месяц (по убыванию)",
        countPerBirthUp: "По общему количеству встреч (по возрастанию)",
        countPerBirthDown: "По общему количеству встреч (по убыванию)",
      },
      currentSelectedWord: [],
      currentAddedWords: [],
      wordPopupVisible: false,
      categoryPopupVisible: false,
      isLoading: false,
    };
  },
  computed: {
    userInfo() {
      let userInfo = this.$store.getters.getUserInfo;
      if (Object.keys(userInfo)?.length == 0) {
        userInfo = this.$api.offline.getUserInfo();
      }
      return userInfo;
    },
    wordsList() {
      let relevance = this.userInfo?.relevance;
      relevance = relevance.filter((item) => item?.offline != "delete");
      let wordsList = relevance.map((item) => {
        let maxDateCheckRelevance =
          this.userInfo?.options?.[0]?.maxDateCheckRelevance;
        let now = this.$api.offline.getDayFromMillisecond(Date.now());
        let dateOfDetected = item?.dateOfDetected;

        let totalCountMeets = dateOfDetected?.length;

        let countMeetsPerDays = dateOfDetected.filter(
          (date) =>
            this.$api.offline.getDayFromMillisecond(date) >=
            now - maxDateCheckRelevance
        );
        countMeetsPerDays = countMeetsPerDays?.length;

        return {
          _id: item._id,
          word: item.word,
          irregularVerb: item.irregularVerb,
          dateOfCreation: item.word,
          dateOfDetected,
          totalCountMeets,
          countMeetsPerDays,
        };
      });
      if (this.search != "") {
        let reg = new RegExp(this.search);
        wordsList = wordsList.filter((item) => reg.test(item.word));
      }
      wordsList = wordsList.sort(this.filterWordsList(this.filter));
      return wordsList;
    },
  },
  methods: {
    filterWordsList(typeFilter) {
      let functions = {
        letterUp: function (a, b) {
          if (a.word < b.word) return -1;
          if (a.word > b.word) return 1;
          return 0;
        },
        letterDown: function (a, b) {
          if (a.word > b.word) return -1;
          if (a.word < b.word) return 1;
          return 0;
        },
        countPerMonthUp: function (a, b) {
          if (a.countMeetsPerDays < b.countMeetsPerDays) return -1;
          if (a.countMeetsPerDays > b.countMeetsPerDays) return 1;
          return 0;
        },
        countPerMonthDown: function (a, b) {
          if (a.countMeetsPerDays > b.countMeetsPerDays) return -1;
          if (a.countMeetsPerDays < b.countMeetsPerDays) return 1;
          return 0;
        },
        countPerBirthUp: function (a, b) {
          if (a.totalCountMeets < b.totalCountMeets) return -1;
          if (a.totalCountMeets > b.totalCountMeets) return 1;
          return 0;
        },
        countPerBirthDown: function (a, b) {
          if (a.totalCountMeets > b.totalCountMeets) return -1;
          if (a.totalCountMeets < b.totalCountMeets) return 1;
          return 0;
        },
      };
      return functions[typeFilter];
    },
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
    },
    async showConfirm(header, title) {
      let confirm = await this.$refs.confirm.show(header, title);
      return confirm;
    },
    validateInput(field, input) {
      if (input == "") {
        this.errors[field] = "Заполните поле!";
        return;
      }
      if (typeof input != "string") {
        this.errors[field] = "Неверный тип данных!";
        return;
      }
      if (!/^[a-zA-Z ,\-;]+$/.test(input)) {
        this.errors[field] =
          "Для записи слов используйте английский алфавит с разделителем в виде запятой или точки с запятой!";
        return;
      }
      if (input.length > 210) {
        this.errors[field] = "Длина списка не должна превышать 200 символов!";
        return;
      }
      delete this.errors[field];
    },
    checkInput() {
      this.validateInput("input", this.input);
      if (this.errors?.input) return;

      let words = this.input.split(/[,;]/);
      words = words.filter((el) => el.trim() != "");
      words = words.map((el) => {
        return el.trim().toLowerCase();
      });
      words = [...new Set(words)];
      if (words?.length == 0) {
        this.showInfo(
          "Добавление слов в актуализатор",
          "Нет ни одного слова для добавления!"
        );
        this.input = "";
        return;
      }
      this.addWords(words);
    },
    async addWords(words) {
      try {
        let confirm = await this.showConfirm(
          "Добавление слов в актуализатор",
          `Вы уверены, что хотите добавить следующие слова: ${words.join(
            ", "
          )}?`
        );
        if (!confirm) return;
        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = this.$store.getters.getAuth
          ? await this.$api.words.addRelevance({ words })
          : this.$api.offline.addRelevance({ words });

        this.isLoading = false;
        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          this.$api.offline.setSignatureAPI(userInfo);
        }
        let message = res?.data?.message || res?.message;
        let addedWords = res?.data?.words || res?.words;
        this.currentAddedWords = [...addedWords];
        await this.showInfo("Добавление слов в актуализатор", message);

        this.input = "";
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        this.isLoading = false;
        this.showInfo("Добавление слов в актуализатор", message);
      }
    },
    async deleteWord() {
      try {
        if (Object.keys(this.currentSelectedWord).length === 0) return;
        let confirm = await this.showConfirm(
          "Удаление слова",
          "Вы уверены, что хотите удалить выбранное слово?"
        );
        if (!confirm) return;
        let id = [this.currentSelectedWord._id];
        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = this.$store.getters.getAuth
          ? await this.$api.words.multipleDeleteWord({ id })
          : this.$api.offline.multipleDeleteWord({ id });

        this.isLoading = false;
        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          this.$api.offline.setSignatureAPI(userInfo);
        }
        let message = res?.data?.message || res?.message;
        await this.showInfo("Удаление слова", message);
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        let status = err?.response?.status;
        this.isLoading = false;
        if (status == 0 || status == 500) {
          message =
            "Сервер не отвечает или интернет соединение утеряно, переводим операции в режим оффлайн, выполните операцию повторно!";
          this.$store.commit("resetAuth");
        }
        this.showInfo("Удаление слова", message);
      }
    },
  },
  watch: {
    input() {
      if (this.errors?.input) this.validateInput("input", this.input);
    },
  },
};
</script>

<style></style>
