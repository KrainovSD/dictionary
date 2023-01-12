<template>
  <learn-card
    v-if="learnCardVisible == true"
    ref="learnCard"
    @close="learnCardVisible = false"
  />
  <info-popup ref="info" />
  <confirm-popup ref="confirm" />
  <loading-popup v-if="isLoading == true" />
  <div
    class="learnPlace__container appearVision"
    @click="currentSelectedWord = {}"
  >
    <div class="knownWords">
      <div class="knownWords__header">
        <div class="knownWords__filterContainer">
          <slide-filter
            @click.stop=""
            :filterList="filterList"
            @change="(payload) => (filter = payload)"
          />
        </div>
        <div class="knownWords__searchContainer">
          <search-panel @click.stop="" v-model="search" />
        </div>
        <button
          class="knownWords__CRUDButton"
          :class="
            Object.keys(currentSelectedWord)?.length == 0 ? 'disabled' : ''
          "
          :disabled="
            Object.keys(currentSelectedWord)?.length == 0 ? true : false
          "
          @click.stop="deleteWord"
        >
          Удалить
        </button>
        <div class="knownWords__lastInfo">
          <p>
            Последнее повторение в обычном режиме:
            {{ lastRepeat }}
          </p>
          <p>
            Последнее повторение в обратном режиме:
            {{ lastReverseRepeat }}
          </p>
        </div>
      </div>

      <div class="knownWords__wordsContainer">
        <div class="knownWords__wordPlaceholder" v-if="wordsList?.length == 0">
          WORDS
        </div>
        <div
          class="knownWords__word"
          @click.stop="
            currentSelectedWord =
              currentSelectedWord?._id == item._id ? {} : item
          "
          v-for="(item, index) in wordsList"
          :key="index"
          :id="item._id"
          :class="currentSelectedWord._id == item._id ? 'selected' : ''"
        >
          <div class="knownWords__info">
            <p>{{ item.word }}</p>
            <p>{{ item.translate }}</p>
            <p>{{ item.transcription }}</p>
          </div>
          <p class="knownWords__description">
            Description: {{ item.description }}
          </p>
          <div class="knownWords__examples" v-if="item.example?.length > 0">
            <p>Examples:</p>
            <p
              v-for="(itemExample, indexExample) in item.example"
              :key="indexExample"
            >
              {{ itemExample }}
            </p>
          </div>
          <div class="knownWords__subInfo">
            <p>
              Последнее повторение в обычном режиме: {{ item.infoLastRepeat }}
            </p>
            <p>
              Последнее повторение в обратном режиме:
              {{ item.infoLastReverseRepeat }}
            </p>
            <p>
              Количество обычных повторений:
              {{ item.infoCountRepeat }}
            </p>
            <p>
              Количество реверсивных повторений:
              {{ item.infoCountReverseRepeat }}
            </p>
            <p>
              Количество ошибок, допущенных в слове: {{ item.wrongs }}
              {{ caseOfCount(item.wrongs) }}
            </p>
          </div>
        </div>
      </div>
      <div class="knownWords__startLearn">
        <button
          class="knownWords__startButton normal"
          :class="[
            colorStandartRepeat,
            userInfo?.knownWords.length == 0 ? 'disabled' : '',
          ]"
          :disabled="userInfo?.knownWords.length == 0 ? true : false"
          @click="startLearn('known')"
        >
          Обычный режим
        </button>
        <p>Количество слов повторяемых за раз: {{ countWordsAtTime }}</p>
        <button
          class="knownWords__startButton reverse"
          :class="[
            colorReverseRepeat,
            userInfo?.knownWords.length == 0 ? 'disabled' : '',
          ]"
          :disabled="userInfo?.knownWords.length == 0 ? true : false"
          @click="startLearn('reKnown')"
        >
          Обратный режим
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import learnCard from "../components/learnCard.vue";
import slideFilter from "../components/slideFilter.vue";
import searchPanel from "../components/searchPanel.vue";
import infoPopup from "../components/infoPopup";
import confirmPopup from "../components/confirmPopup";
import loadingPopup from "../components/loadingPopup.vue";
import { nextTick } from "@vue/runtime-core";
export default {
  components: {
    learnCard,
    slideFilter,
    searchPanel,
    infoPopup,
    confirmPopup,
    loadingPopup,
  },
  data() {
    return {
      search: "",
      filter: "letterUp",
      filterList: {
        letterUp: "По алфавиту от A до Z",
        letterDown: "По алфавиту от Z до A",
        lastCommonRepeatUp:
          "По дате последнего повторения в обычном режиме (по возрастанию)",
        lastCommonRepeatDown:
          "По дате последнего повторения в обычном режиме (по убыванию)",
        lastReverseRepeatUp:
          "По дате последнего повторения в обратном режиме (по возрастанию)",
        lastReverseRepeatDown:
          "По дате последнего повторения в обратном режиме (по убыванию)",
        wrongsUp: "По количеству ошибок при повторении слова (по возрастанию)",
        wrongsDown: "По количеству ошибок при повторении слова (по убыванию)",
        countRepeatUp:
          "По количеству обычных повторений слова (по возрастанию)",
        countRepeatDown: "По количеству обычных повторений слова (по убыванию)",
        countReverseRepeatUp:
          "По количеству реверсивных повторений слова (по возрастанию)",
        countReverseRepeatDown:
          "По количеству реверсивных повторений слова (по убыванию)",
      },
      learnCardVisible: false,
      isLoading: false,
      currentSelectedWord: {},
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
    lastRepeat() {
      if (
        this.userInfo?.statistics?.[0]?.lastRepeatKnownWords != 0 &&
        this.userInfo?.statistics?.[0]?.lastRepeatKnownWords
      )
        return this.dateFormatter(
          this.userInfo?.statistics?.[0]?.lastRepeatKnownWords
        );
      return "Никогда";
    },
    lastReverseRepeat() {
      if (
        this.userInfo?.statistics?.[0]?.lastReverseRepeatKnownWords != 0 &&
        this.userInfo?.statistics?.[0]?.lastReverseRepeatKnownWords
      )
        return this.dateFormatter(
          this.userInfo?.statistics?.[0]?.lastReverseRepeatKnownWords
        );
      return "Никогда";
    },
    countWordsAtTime() {
      if (
        this.userInfo?.options?.[0]?.countKnownWordsAtOneTime != 0 &&
        this.userInfo?.options?.[0]?.countKnownWordsAtOneTime
      )
        return this.userInfo?.options?.[0]?.countKnownWordsAtOneTime;
      return "Не обнаружено";
    },
    wordsList() {
      let words = this.userInfo?.knownWords;
      words = words.filter((item) => item?.offline != "delete");

      if (this.search != "") {
        let reg = new RegExp(this.search);
        words = words.filter(
          (item) => reg.test(item.word) || reg.test(item.translate)
        );
      }

      let wordsList = words.map((item) => {
        let infoLastRepeat;
        let infoLastReverseRepeat;
        if (item.lastRepeat == 0) infoLastRepeat = "Никогда";
        else infoLastRepeat = this.dateFormatter(item.lastRepeat);
        if (item.lastReverseRepeat == 0) infoLastReverseRepeat = "Никогда";
        else infoLastReverseRepeat = this.dateFormatter(item.lastReverseRepeat);

        let infoCountRepeat = item.historyOfRepeat.length;
        let infoCountReverseRepeat = item.historyOfReverseRepeat.length;

        let example = [];
        for (let itemExample of item.example) {
          if (itemExample == "") continue;
          example.push(itemExample);
        }

        return {
          _id: item._id,
          word: item.word,
          translate: item.translate,
          transcription: item.transcription,
          description: item.description,
          example,
          wrongs: item.wrongs,
          irregularVerb: item.irregularVerb,
          lastRepeat: item.lastRepeat,
          lastReverseRepeat: item.lastReverseRepeat,
          dateOfKnown: this.dateFormatter(item.dateOfKnown),
          infoLastRepeat,
          infoLastReverseRepeat,
          infoCountRepeat,
          infoCountReverseRepeat,
        };
      });

      wordsList = wordsList.sort(this.filterWordsList(this.filter));
      return wordsList;
    },
    colorStandartRepeat() {
      if (!this.userInfo?.statistics?.[0]?.lastRepeatKnownWords) return "red";
      let now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      let lastRepeatKnownWords = Math.floor(
        this.userInfo?.statistics?.[0]?.lastRepeatKnownWords /
          (1000 * 60 * 60 * 24)
      );
      if (now > lastRepeatKnownWords) {
        if (now - lastRepeatKnownWords == 1) return "yellow";
        return "red";
      }

      return "green";
    },
    colorReverseRepeat() {
      if (!this.userInfo?.statistics?.[0]?.lastReverseRepeatKnownWords)
        return "red";
      let now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      let lastReverseRepeatKnownWords = Math.floor(
        this.userInfo?.statistics?.[0]?.lastReverseRepeatKnownWords /
          (1000 * 60 * 60 * 24)
      );
      if (now > lastReverseRepeatKnownWords) {
        if (now - lastReverseRepeatKnownWords == 1) return "yellow";
        return "red";
      }
      return "green";
    },
  },
  methods: {
    caseOfCount(wrongs) {
      if (wrongs == 2 || wrongs == 3 || wrongs == 4) return "раза";
      return "раз";
    },
    dateFormatter(date) {
      date = new Date(date);
      let minute = date.getMinutes();
      let hour = date.getHours();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      if (minute >= 0 && minute < 10) {
        minute = `0${minute}`;
      }
      if (hour >= 0 && hour < 10) {
        hour = `0${hour}`;
      }

      return `${day}-${month}-${year}`;
    },
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
        lastCommonRepeatUp: function (a, b) {
          if (a.lastRepeat < b.lastRepeat) return -1;
          if (a.lastRepeat > b.lastRepeat) return 1;
          return 0;
        },
        lastCommonRepeatDown: function (a, b) {
          if (a.lastRepeat > b.lastRepeat) return -1;
          if (a.lastRepeat < b.lastRepeat) return 1;
          return 0;
        },
        lastReverseRepeatUp: function (a, b) {
          if (a.lastReverseRepeat < b.lastReverseRepeat) return -1;
          if (a.lastReverseRepeat > b.lastReverseRepeat) return 1;
          return 0;
        },
        lastReverseRepeatDown: function (a, b) {
          if (a.lastReverseRepeat > b.lastReverseRepeat) return -1;
          if (a.lastReverseRepeat < b.lastReverseRepeat) return 1;
          return 0;
        },
        wrongsUp: function (a, b) {
          if (a.wrongs < b.wrongs) return -1;
          if (a.wrongs > b.wrongs) return 1;
          return 0;
        },
        wrongsDown: function (a, b) {
          if (a.wrongs > b.wrongs) return -1;
          if (a.wrongs < b.wrongs) return 1;
          return 0;
        },
        countRepeatUp: function (a, b) {
          if (a.infoCountRepeat < b.infoCountRepeat) return -1;
          if (a.infoCountRepeat > b.infoCountRepeat) return 1;
          return 0;
        },
        countRepeatDown: function (a, b) {
          if (a.infoCountRepeat > b.infoCountRepeat) return -1;
          if (a.infoCountRepeat < b.infoCountRepeat) return 1;
          return 0;
        },
        countReverseRepeatUp: function (a, b) {
          if (a.infoCountReverseRepeat < b.infoCountReverseRepeat) return -1;
          if (a.infoCountReverseRepeat > b.infoCountReverseRepeat) return 1;
          return 0;
        },
        countReverseRepeatDown: function (a, b) {
          if (a.infoCountReverseRepeat > b.infoCountReverseRepeat) return -1;
          if (a.infoCountReverseRepeat < b.infoCountReverseRepeat) return 1;
          return 0;
        },
      };
      return functions[typeFilter];
    },
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
    },
    async showConfirm(header, title) {
      let res = await this.$refs.confirm.show(header, title);
      return res;
    },
    async startLearn(type) {
      let words = this.userInfo.knownWords;
      words = words.filter((item) => item?.offline != "delete");
      if (type == "known") {
        words = words.sort(this.filterWordsList("lastCommonRepeatUp"));
      }
      if (type == "reKnown") {
        words = words.sort(this.filterWordsList("lastReverseRepeatUp"));
      }

      let wordsLength = words.length;
      let countKnownWordsAtOneTime =
        this.userInfo.options[0].countKnownWordsAtOneTime;
      let countWords;
      if (wordsLength < countKnownWordsAtOneTime) countWords = wordsLength;
      else countWords = countKnownWordsAtOneTime;
      if (countWords == 0) return;
      words = words.slice(0, countWords);

      words = words.sort(() => Math.random() - 0.5);
      this.learnCardVisible = true;
      await nextTick();
      this.$refs.learnCard.start(type, words);
    },
    async deleteWord() {
      try {
        if (Object.keys(this.currentSelectedWord)?.length == 0) return;
        let id = this.currentSelectedWord?._id;

        let confirm = await this.showConfirm(
          "Удаление слова",
          "Вы уверены, что хотите удалить выбранное слово?"
        );
        if (!confirm) return;

        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = this.$store.getters.getAuth
          ? await this.$api.words.deleteWord(id)
          : this.$api.offline.deleteWord(id);

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
  watch: {},
};
</script>

<style></style>
