<template>
  <learn-card
    v-if="learnCardVisible == true"
    ref="learnCard"
    @close="learnCardVisible = false"
  />
  <div class="learnPlace__container">
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
        <div class="repeatWords__wordPlaceholder" v-if="wordsList?.length == 0">
          WORDS
        </div>
        <div
          class="repeatWords__word"
          :class="wordColor(item._id)"
          v-for="(item, index) in wordsList"
          :key="index"
        >
          <div class="repeatWords__info">
            <p>{{ item.word }}</p>
            <p>{{ item.translate }}</p>
            <p>{{ item.transcription }}</p>
          </div>
          <p class="repeatWords__description">
            Description: {{ item.description }}
          </p>
          <div class="repeatWords_examples" v-if="item.example?.length > 0">
            <p>Examples:</p>
            <p
              v-for="(itemExample, indexExample) in item.example"
              :key="indexExample"
            >
              {{ itemExample }}
            </p>
          </div>
          <p class="repeatWords__subInfo">
            Следующее обычное повторение: {{ item.infoNextRepeat }}
          </p>
          <p class="repeatWords__subInfo">
            Следующее реверсивное повторение: {{ item.infoNextReverseRepeat }}
          </p>
          <p class="repeatWords__subInfo">
            Осталось обычных повторений: {{ item.infoCountOfRepeat }}
          </p>
          <p class="repeatWords__subInfo">
            Осталось реверсивных повторений: {{ item.infoCountOfReverseRepeat }}
          </p>
        </div>
      </div>
      <div class="repeatWords__startLearn">
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
import { nextTick } from "@vue/runtime-core";
export default {
  components: {
    learnCard,
    slideFilter,
    searchPanel,
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
    };
  },
  computed: {
    userInfo() {
      let userInfo = this.$store.getters.getUserInfo;
      if (Object.keys(userInfo)?.length == 0) {
        userInfo = this.getUserInfoFromLocalStorage();
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
        let example = [];
        for (let itemExample of item.example) {
          if (itemExample == "") continue;
          example.push(itemExample);
        }

        let infoNextRepeat =
          item.nextRepeat != 0
            ? this.dateFormatter(item.nextRepeat)
            : "Сегодня";
        let infoNextReverseRepeat =
          item.nextReverseRepeat != 0
            ? this.dateFormatter(item.nextReverseRepeat)
            : "Сегодня";
        let infoCountOfRepeat = 9 - item.countOfRepeat;
        let infoCountOfReverseRepeat = 9 - item.countOfReverseRepeat;

        return {
          _id: item._id,
          word: item.word,
          translate: item.translate,
          transcription: item.transcription,
          description: item.description,
          example,
          irregularVerb: item.irregularVerb,
          nextRepeat: item.nextRepeat,
          nextReverseRepeat: item.nextReverseRepeat,
          historyOfRepeat: item.historyOfRepeat,
          historyOfReverseRepeat: item.historyOfReverseRepeat,
          countOfRepeat: item.countOfRepeat,
          countOfReverseRepeat: item.countOfReverseRepeat,
          infoNextRepeat,
          infoNextReverseRepeat,
          infoCountOfRepeat,
          infoCountOfReverseRepeat,
        };
      });

      wordsList = wordsList.sort(this.filterWordsList(this.filter));
      return wordsList;
    },
    colorStandartRepeat() {
      if (!this.userInfo?.wordsToRepeat) return "green";
      let words = this.userInfo.wordsToRepeat;
      if (words.length == 0) return "green";
      words = words.filter((item) => {
        let nextRepeat = Math.floor(item.nextRepeat / (1000 * 60 * 60 * 24));
        let now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
        if (nextRepeat < now) return true;
        return false;
      });
      if (words.length == 0) return "green";
      return "red";
    },
    colorReverseRepeat() {
      if (!this.userInfo?.wordsToRepeat) return "green";
      let words = this.userInfo.wordsToRepeat;
      if (words.length == 0) return "green";
      words = words.filter((item) => {
        let nextReverseRepeat = Math.floor(
          item.nextReverseRepeat / (1000 * 60 * 60 * 24)
        );
        let now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
        if (nextReverseRepeat < now) return true;
        return false;
      });
      if (words.length == 0) return "green";
      return "red";
    },
  },
  methods: {
    wordColor(id) {
      let index = this.userInfo?.wordsToRepeat.findIndex(
        (item) => item._id == id
      );
      if (index == -1) return "";
      let word = this.userInfo?.wordsToRepeat[index];
      let nextRepeat = Math.floor(word.nextRepeat / (1000 * 60 * 60 * 24));
      let nextReverseRepeat = Math.floor(
        word.nextReverseRepeat / (1000 * 60 * 60 * 24)
      );
      let now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      if (nextRepeat < now || nextReverseRepeat < now) return "red";
      return "";
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
    async startLearn(type) {
      let words = this.userInfo.wordsToRepeat;
      if (type == "repeat") {
        words = words.filter((item) => {
          let nextRepeat = Math.floor(item.nextRepeat / (1000 * 60 * 60 * 24));
          let now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
          if (nextRepeat > now) return false;
          return true;
        });
      }
      if (type == "reRepeat") {
        words = words.filter((item) => {
          let nextReverseRepeat = Math.floor(
            item.nextReverseRepeat / (1000 * 60 * 60 * 24)
          );
          let now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
          if (nextReverseRepeat > now) return false;
          return true;
        });
      }

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
