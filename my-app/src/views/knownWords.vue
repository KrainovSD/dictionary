<template>
  <learn-card
    v-if="learnCardVisible == true"
    ref="learnCard"
    @close="learnCardVisible = false"
  />
  <info-popup ref="info" />
  <confirm-popup ref="confirm" />
  <loading-popup v-if="isLoading == true" />
  <div class="learnPlace__container appearVision">
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
            currentSelectedWord == ''
              ? currentMultiSelectedWords.length > 0
                ? ''
                : 'disabled'
              : ''
          "
          :disabled="
            currentSelectedWord == ''
              ? currentMultiSelectedWords.length > 0
                ? false
                : true
              : false
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
        <div class="knownWords__lastInfoMobile">
          <p>
            Последнее повторение в обычном режиме:
            {{ lastRepeat }}
          </p>
          <p>
            Последнее повторение в обратном режиме:
            {{ lastReverseRepeat }}
          </p>
        </div>
        <word-card
          :wordsList="wordsList"
          :currentMultiSelectedWords="currentMultiSelectedWords"
          @changeCurrentSelectedWord="
            (payload) => (currentSelectedWord = payload)
          "
          @changeMultiSelected="
            (payload) => (currentMultiSelectedWords = payload)
          "
          @delete="
            (payload) => {
              currentSelectedWordID = payload;
              deleteWord();
            }
          "
        />
      </div>
      <div class="knownWords__startLearn" ref="fixedItems">
        <img
          src="@/assets/cancel.png"
          alt=""
          class="knownWords__cancelMobile"
          v-if="currentMultiSelectedWords.length > 0"
          @click="this.currentMultiSelectedWords = []"
        />
        <button
          class="knownWords__startButton normal"
          :class="[
            colorStandartRepeat,
            userInfo?.knownWords.length == 0 ? 'disabled' : '',
          ]"
          :disabled="userInfo?.knownWords.length == 0 ? true : false"
          v-if="isButtonRepeatVisible"
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
          v-if="isButtonRepeatVisible"
          @click="startLearn('reKnown')"
        >
          Обратный режим
        </button>
        <img
          src="@/assets/delete.png"
          alt=""
          v-if="currentMultiSelectedWords.length > 0"
          class="knownWords__deleteMobile"
          @click="deleteWord"
        />
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
import wordCard from "../components/wordCard";
import { nextTick } from "@vue/runtime-core";
export default {
  components: {
    learnCard,
    slideFilter,
    searchPanel,
    infoPopup,
    confirmPopup,
    loadingPopup,
    wordCard,
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
      currentSelectedWord: "",
      currentMultiSelectedWords: [],
      topFixedItems: 0,
    };
  },
  mounted() {
    let fixedItems = this.$refs.fixedItems;
    let { top } = this.getCoords(fixedItems);
    this.topFixedItems = top;

    window.addEventListener("scroll", this.toggleFixedMobileItems);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.toggleFixedMobileItems);
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
        this.userInfo.statistics?.[0]?.lastRepeatKnownWords != 0 &&
        this.userInfo.statistics?.[0]?.lastRepeatKnownWords
      )
        return this.$api.offline.formatDate(
          this.userInfo.statistics[0].lastRepeatKnownWords
        );
      return "Никогда";
    },
    lastReverseRepeat() {
      if (
        this.userInfo?.statistics?.[0]?.lastReverseRepeatKnownWords != 0 &&
        this.userInfo?.statistics?.[0]?.lastReverseRepeatKnownWords
      )
        return this.$api.offline.formatDate(
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
        else infoLastRepeat = this.$api.offline.formatDate(item.lastRepeat);
        if (item.lastReverseRepeat == 0) infoLastReverseRepeat = "Никогда";
        else
          infoLastReverseRepeat = this.$api.offline.formatDate(
            item.lastReverseRepeat
          );

        let infoCountRepeat = item.historyOfRepeat.length;
        let infoCountReverseRepeat = item.historyOfReverseRepeat.length;

        let infoExample = [];
        for (let itemExample of item.example) {
          if (itemExample == "") continue;
          infoExample.push(itemExample);
        }

        return {
          _id: item._id,
          word: item.word,
          translate: item.translate,
          transcription: item.transcription,
          description: item.description,
          example: item.example,
          wrongs: item.wrongs,
          irregularVerb: item.irregularVerb,
          lastRepeat: item.lastRepeat,
          lastReverseRepeat: item.lastReverseRepeat,
          dateOfKnown: item.dateOfKnown,
          infoExample,
          infoLastRepeat,
          infoLastReverseRepeat,
          infoCountRepeat,
          infoCountReverseRepeat,
          infoMultiSelect: true,
        };
      });

      wordsList = wordsList.sort(this.filterWordsList(this.filter));
      return wordsList;
    },
    colorStandartRepeat() {
      if (!this.userInfo?.statistics?.[0]?.lastRepeatKnownWords) return "red";
      let now = this.$api.offline.getDayFromMillisecond(Date.now());
      let lastRepeatKnownWords = this.$api.offline.getDayFromMillisecond(
        this.userInfo?.statistics?.[0]?.lastRepeatKnownWords
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
      let now = this.$api.offline.getDayFromMillisecond(Date.now());
      let lastReverseRepeatKnownWords = this.$api.offline.getDayFromMillisecond(
        this.userInfo?.statistics?.[0]?.lastReverseRepeatKnownWords
      );

      if (now > lastReverseRepeatKnownWords) {
        if (now - lastReverseRepeatKnownWords == 1) return "yellow";
        return "red";
      }
      return "green";
    },
    isButtonRepeatVisible() {
      if (
        this.currentMultiSelectedWords.length == 0 ||
        window.innerWidth > 1023
      )
        return true;
      return false;
    },
  },
  methods: {
    toggleFixedMobileItems() {
      if (window.innerWidth > 1023) return;

      let fixedItems = this.$refs.fixedItems;
      let objectTop = this.topFixedItems;
      const headerHeight = 65;
      const pageTop = window.scrollY + headerHeight;
      if (objectTop > pageTop && fixedItems.classList.contains("_fixed")) {
        fixedItems.classList.remove("_fixed");
      } else if (
        objectTop <= pageTop &&
        !fixedItems.classList.contains("_fixed")
      ) {
        fixedItems.classList.add("_fixed");
      }
    },
    getCoords(elem) {
      let box = elem.getBoundingClientRect();
      return {
        top: box.top + scrollY,
        left: box.left + scrollX,
        right: box.right + scrollX,
        bottom: box.bottom + scrollY,
      };
    },
    caseOfCount(wrongs) {
      if (wrongs == 2 || wrongs == 3 || wrongs == 4) return "раза";
      return "раз";
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
        let id;
        if (this.currentSelectedWord == "") {
          id = this.currentMultiSelectedWords;
          let confirm = await this.showConfirm(
            "Удаление слова",
            "Вы уверены, что хотите удалить выбранные слова?"
          );
          if (!confirm) return;
        } else {
          id = [this.currentSelectedWord];

          let confirm = await this.showConfirm(
            "Удаление слова",
            "Вы уверены, что хотите удалить выбранное слово?"
          );
          if (!confirm) return;
        }
        this.currentMultiSelectedWords = [];

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
  watch: {},
};
</script>

<style></style>
