<template>
  <learn-card
    :learnType="learnType"
    v-if="learnCardVisible == true"
    @close="learnCardVisible = false"
  />
  <div class="learnPlace__container">
    <div class="knownWords">
      <div class="knownWords__header">
        <div class="knownWords__filterContainer">
          <slide-filter
            :filterList="filterList"
            @change="(payload) => (filter = payload)"
          />
        </div>
        <div class="knownWords__searchContainer">
          <search-panel v-model="search" />
        </div>

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
        <div class="knownWords__word">
          <div class="knownWords__info">
            <p>Always</p>
            <p>Всегда</p>
            <p>[dsdsdwe]</p>
          </div>
          <p class="knownWords__description">
            Description: It is used to show thing that happen very often
          </p>
          <div class="knownWords__examples">
            <p>Examples:</p>
            <p>I always try to sleep</p>
            <p>I always eat my breakfast</p>
          </div>
          <div class="knownWords__dateToRepeat">
            <p>Последнее повторение в обычном режиме: {{}}</p>
            <p>Последнее повторение в обратном режиме: {{}}</p>
          </div>
        </div>
        <div class="knownWords__word">
          <div class="knownWords__info">
            <p>See - Saw - Seen</p>
            <p>Всегда</p>
            <p>[dsdsdwe]</p>
          </div>
          <p class="knownWords__description">
            Description: It is used to show thing that happen very often
          </p>
          <div class="knownWords_examples">
            <p>Examples:</p>
            <p>I always try to sleep</p>
            <p>I always eat my breakfast</p>
          </div>
          <div class="knownWords__dateToRepeat">
            <p>Последнее повторение в обычном режиме: {{}}</p>
            <p>Последнее повторение в обратном режиме: {{}}</p>
          </div>
        </div>
        <div class="knownWords__word">
          <div class="knownWords__info">
            <p>Always</p>
            <p>Всегда</p>
            <p>[dsdsdwe]</p>
          </div>
          <p class="knownWords__description">
            Description: It is used to show thing that happen very often
          </p>
          <div class="knownWords_examples">
            <p>Examples:</p>
            <p>I always try to sleep</p>
            <p>I always eat my breakfast</p>
          </div>
          <div class="knownWords__dateToRepeat">
            <p>Последнее повторение в обычном режиме: {{}}</p>
            <p>Последнее повторение в обратном режиме: {{}}</p>
          </div>
        </div>
      </div>
      <div class="knownWords__startLearn">
        <button
          class="knownWords__startButton normal red"
          @click="startLearn('standart')"
        >
          Обычный режим
        </button>
        <p>Количество слов повторяемых за раз: {{ countWordsAtTime }}</p>
        <button
          class="knownWords__startButton reverse red"
          @click="startLearn('reverse')"
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
        lastCommonRepeatUp:
          "По дате последнего повторения в обычном режиме (по возрастанию)",
        lastCommonRepeatDown:
          "По дате последнего повторения в обычном режиме (по убыванию)",
        lastReverseRepeatUp:
          "По дате последнего повторения в обратном режиме (по возрастанию)",
        lastReverseRepeatDown:
          "По дате последнего повторения в обратном режиме (по убыванию)",
      },
      learnCardVisible: false,
      learnType: "standart",
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
    lastRepeat() {
      if (
        this.userInfo?.statistics?.[0]?.lastRepeatKnownWords != 0 &&
        this.userInfo?.statistics?.[0]?.lastRepeatKnownWords
      )
        return this.dateFormatter(
          this.userInfo?.statistics?.[0]?.lastRepeatKnownWords
        );
      return "Не найдено";
    },
    lastReverseRepeat() {
      if (
        this.userInfo?.statistics?.[0]?.lastReverseRepeatKnownWords != 0 &&
        this.userInfo?.statistics?.[0]?.lastReverseRepeatKnownWords
      )
        return this.dateFormatter(
          this.userInfo?.statistics?.[0]?.lastReverseRepeatKnownWords
        );
      return "Не найдено";
    },
    countWordsAtTime() {
      if (
        this.userInfo?.options?.[0]?.countKnownWordsAtOneTime != 0 &&
        this.userInfo?.options?.[0]?.countKnownWordsAtOneTime
      )
        return this.userInfo?.options?.[0]?.countKnownWordsAtOneTime;
      return "Не обнаружено";
    },
  },
  methods: {
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
    startLearn(type) {
      this.learnType = type;
      this.learnCardVisible = true;
    },
  },
  watch: {},
};
</script>

<style></style>
