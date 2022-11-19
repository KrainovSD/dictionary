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

        <div class="knownWords__searchContainer _close" ref="search">
          <img
            src="@/assets/search.png"
            alt=""
            class="knownWords__searchIcon"
            @click="showSearch"
          />
          <input
            type="text"
            class="knownWords__search"
            placeholder="Search"
            v-if="searching == true"
            v-model="search"
          />
        </div>
        <div class="knownWords__lastInfo">
          <p>Последнее повторение в обычном режиме: {{}}</p>
          <p>Последнее повторение в обратном режиме: {{}}</p>
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
        <p>Количество слов повторяемых за раз: {{}}</p>
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
export default {
  components: {
    learnCard,
    slideFilter,
  },
  data() {
    return {
      searching: false,
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

  methods: {
    showSearch() {
      let search = this.$refs.search;
      if (!search.classList.contains("_close")) {
        search.classList.toggle("_close");
        this.searching = false;
        this.search = "";
        return;
      }
      search.classList.toggle("_close");
      this.searching = true;
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
