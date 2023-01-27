<template>
  <learn-card
    v-if="learnCardVisible == true"
    ref="learnCard"
    @close="learnCardVisible = false"
  />
  <div class="learnPlace__container appearVision">
    <div class="repeatWords">
      <div class="repeatWords__header">
        <div class="knownWords__filterContainer">
          <slide-filter
            :filterList="filterList"
            @change="(payload) => (filter = payload)"
          />
        </div>
        <div class="knownWords__searchContainer">
          <search-panel v-model="search" />
        </div>

        <div class="repeatWords__lastInfo">
          <p>
            Количество ошибок в слове для добавления: {{ countWrongsToAdd }}
          </p>
        </div>
      </div>

      <div class="repeatWords__wordsContainer">
        <word-card
          :wordsList="wordsList"
          :currentMultiSelectedWords="currentMultiSelectedWords"
        />
      </div>
      <div class="repeatWords__startLearn" ref="fixedItems">
        <button
          class="repeatWords__startButton normal red"
          :class="[
            userInfo?.wordsToRepeat?.length == 0 ? 'disabled' : '',
            colorStandartRepeat,
          ]"
          :disabled="userInfo?.wordsToRepeat?.length == 0 ? true : false"
          @click="startLearn('repeat')"
        >
          Обычный режим
        </button>
        <div class="repeatWords__infoMobile">
          <p>
            Количество ошибок в слове для добавления: {{ countWrongsToAdd }}
          </p>
        </div>
        <button
          class="repeatWords__startButton reverse red"
          :class="[
            userInfo?.wordsToRepeat?.length == 0 ? 'disabled' : '',
            colorReverseRepeat,
          ]"
          :disabled="userInfo?.wordsToRepeat?.length == 0 ? true : false"
          @click="startLearn('reRepeat')"
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
import wordCard from "../components/wordCard";
import { nextTick } from "@vue/runtime-core";
export default {
  components: {
    learnCard,
    slideFilter,
    searchPanel,
    wordCard,
  },

  data() {
    return {
      search: "",
      filter: "letterUp",
      filterList: {
        letterUp: "По алфавиту от A до Z",
        letterDown: "По алфавиту от Z до A",
        nextRepeatUp: "По дате следующего обычного повторения (по возрастанию)",
        nextRepeatDown: "По дате следующего обычного повторения (по убыванию)",
        nextReverseRepeatUp:
          "По дате следующего реверсивного повторения (по возрастанию)",
        nextReverseRepeatDown:
          "По дате следующего реверсивного повторения (по убыванию)",
        countRepeatUp:
          "По количеству оставшихся обычных повторений (по возрастанию)",
        countRepeatDown:
          "По количеству оставшихся обычных повторений (по убыванию)",
        countReverseRepeatUp:
          "По количеству оставшихся реверсивных повторений (по возрастанию)",
        countReverseRepeatDown:
          "По количеству оставшихся реверсивных повторений (по убыванию)",
      },
      learnCardVisible: false,
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
    countWrongsToAdd() {
      if (this.userInfo?.options?.[0]?.countWrongsToAddToRepeat)
        return this.userInfo?.options?.[0]?.countWrongsToAddToRepeat;
      return "Не обнаружено";
    },
    wordsList() {
      let words = this.userInfo?.wordsToRepeat;
      words = words.filter((item) => item?.offline != "delete");

      if (this.search != "") {
        let reg = new RegExp(this.search);
        words = words.filter(
          (item) => reg.test(item.word) || reg.test(item.translate)
        );
      }

      let wordsList = words.map((item) => {
        let infoExample = [];
        for (let itemExample of item.example) {
          if (itemExample == "") continue;
          infoExample.push(itemExample);
        }

        let infoNextRepeat =
          item.nextRepeat == 0
            ? "Сегодня"
            : this.$api.offline.getDayFromMillisecond(item.nextRepeat) -
                this.$api.offline.getDayFromMillisecond(Date.now()) >
              100
            ? "Никогда"
            : this.$api.offline.formatDate(item.nextRepeat);
        let infoNextReverseRepeat =
          item.nextReverseRepeat == 0
            ? "Сегодня"
            : this.$api.offline.getDayFromMillisecond(item.nextReverseRepeat) -
                this.$api.offline.getDayFromMillisecond(Date.now()) >
              50
            ? "Никогда"
            : this.$api.offline.formatDate(item.nextReverseRepeat);

        let infoCountOfRepeat = 9 - item.countOfRepeat;
        let infoCountOfReverseRepeat = 9 - item.countOfReverseRepeat;

        return {
          _id: item._id,
          word: item.word,
          translate: item.translate,
          transcription: item.transcription,
          description: item.description,
          example: item.example,
          irregularVerb: item.irregularVerb,
          nextRepeat: item.nextRepeat,
          nextReverseRepeat: item.nextReverseRepeat,
          historyOfRepeat: item.historyOfRepeat,
          historyOfReverseRepeat: item.historyOfReverseRepeat,
          countOfRepeat: item.countOfRepeat,
          countOfReverseRepeat: item.countOfReverseRepeat,
          dateOfCreation: item.dateOfCreation,
          infoExample,
          infoNextRepeat,
          infoNextReverseRepeat,
          infoCountOfRepeat,
          infoCountOfReverseRepeat,
          infoMultiSelect: false,
        };
      });

      wordsList = wordsList.sort(this.filterWordsList(this.filter));
      return wordsList;
    },
    colorStandartRepeat() {
      if (!this.userInfo?.wordsToRepeat) return "";
      let words = this.userInfo.wordsToRepeat;
      words = words.filter((item) => item?.offline != "delete");
      if (words.length == 0) return "";
      let isRed = words.filter((item) => {
        let dateOfCreation = this.$api.offline.getDayFromMillisecond(
          item.dateOfCreation
        );
        let nextRepeat = this.$api.offline.getDayFromMillisecond(
          item.nextRepeat
        );
        let now = this.$api.offline.getDayFromMillisecond(Date.now());

        if (nextRepeat < now && now - dateOfCreation > 1) return true;
        return false;
      });
      if (isRed.length > 0) return "red";
      let isYellow = words.filter((item) => {
        let dateOfCreation = this.$api.offline.getDayFromMillisecond(
          item.dateOfCreation
        );
        let nextRepeat = this.$api.offline.getDayFromMillisecond(
          item.nextRepeat
        );
        let now = this.$api.offline.getDayFromMillisecond(Date.now());

        if (nextRepeat == now || (nextRepeat < now && now - dateOfCreation > 1))
          return true;
        return false;
      });
      if (isYellow.length > 0) return "yellow";
      return "green";
    },
    colorReverseRepeat() {
      if (!this.userInfo?.wordsToRepeat) return "";
      let words = this.userInfo.wordsToRepeat;
      words = words.filter((item) => item?.offline != "delete");
      if (words.length == 0) return "";
      let isRed = words.filter((item) => {
        let dateOfCreation = this.$api.offline.getDayFromMillisecond(
          item.dateOfCreation
        );
        let nextReverseRepeat = this.$api.offline.getDayFromMillisecond(
          item.nextReverseRepeat
        );
        let now = this.$api.offline.getDayFromMillisecond(Date.now());

        if (nextReverseRepeat < now && now - dateOfCreation > 1) return true;
        return false;
      });

      if (isRed.length > 0) return "red";
      let isYellow = words.filter((item) => {
        let dateOfCreation = this.$api.offline.getDayFromMillisecond(
          item.dateOfCreation
        );

        let nextReverseRepeat = this.$api.offline.getDayFromMillisecond(
          item.nextReverseRepeat
        );
        let now = this.$api.offline.getDayFromMillisecond(Date.now());
        if (
          nextReverseRepeat == now ||
          (nextReverseRepeat < now && now - dateOfCreation > 1)
        )
          return true;
        return false;
      });
      if (isYellow.length > 0) return "yellow";
      return "green";
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
        nextRepeatUp: function (a, b) {
          if (a.nextRepeat < b.nextRepeat) return -1;
          if (a.nextRepeat > b.nextRepeat) return 1;
          return 0;
        },
        nextRepeatDown: function (a, b) {
          if (a.nextRepeat > b.nextRepeat) return -1;
          if (a.nextRepeat < b.nextRepeat) return 1;
          return 0;
        },
        nextReverseRepeatUp: function (a, b) {
          if (a.nextReverseRepeat < b.nextReverseRepeat) return -1;
          if (a.nextReverseRepeat > b.nextReverseRepeat) return 1;
          return 0;
        },
        nextReverseRepeatDown: function (a, b) {
          if (a.nextReverseRepeat > b.nextReverseRepeat) return -1;
          if (a.nextReverseRepeat < b.nextReverseRepeat) return 1;
          return 0;
        },
        countRepeatUp: function (a, b) {
          if (a.infoCountOfRepeat < b.infoCountOfRepeat) return -1;
          if (a.infoCountOfRepeat > b.infoCountOfRepeat) return 1;
          return 0;
        },
        countRepeatDown: function (a, b) {
          if (a.infoCountOfRepeat > b.infoCountOfRepeat) return -1;
          if (a.infoCountOfRepeat < b.infoCountOfRepeat) return 1;
          return 0;
        },
        countReverseRepeatUp: function (a, b) {
          if (a.infoCountOfReverseRepeat < b.infoCountOfReverseRepeat)
            return -1;
          if (a.infoCountOfReverseRepeat > b.infoCountOfReverseRepeat) return 1;
          return 0;
        },
        countReverseRepeatDown: function (a, b) {
          if (a.infoCountOfReverseRepeat > b.infoCountOfReverseRepeat)
            return -1;
          if (a.infoCountOfReverseRepeat < b.infoCountOfReverseRepeat) return 1;
          return 0;
        },
      };
      return functions[typeFilter];
    },
    async startLearn(type) {
      let words = this.userInfo.wordsToRepeat;
      if (type == "repeat") {
        words = words.filter((item) => {
          let nextRepeat = this.$api.offline.getDayFromMillisecond(
            item.nextRepeat
          );
          let now = this.$api.offline.getDayFromMillisecond(Date.now());

          if (nextRepeat > now) return false;
          return true;
        });
      }
      if (type == "reRepeat") {
        words = words.filter((item) => {
          let nextReverseRepeat = this.$api.offline.getDayFromMillisecond(
            item.nextReverseRepeat
          );
          let now = this.$api.offline.getDayFromMillisecond(Date.now());
          if (nextReverseRepeat > now) return false;
          return true;
        });
      }
      words = words.filter((item) => item?.offline != "delete");
      if (words.length == 0) return;

      words = words.sort(() => Math.random() - 0.5);
      this.learnCardVisible = true;
      await nextTick();
      this.$refs.learnCard.start(type, words);
    },
  },
};
</script>

<style></style>
