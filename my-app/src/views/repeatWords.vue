<template>
  <learn-card
    :learnType="learnType"
    v-if="learnCardVisible == true"
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

        <div class="repeatWords__searchContainer _close" ref="search">
          <img
            src="@/assets/search.png"
            alt=""
            class="repeatWords__searchIcon"
            @click="showSearch"
          />
          <input
            type="text"
            class="repeatWords__search"
            placeholder="Search"
            v-if="searching == true"
            v-model="search"
          />
        </div>
        <div class="repeatWords__lastInfo">
          <p>Количество ошибок в слове для добавления:{{}}</p>
        </div>
      </div>

      <div class="repeatWords__wordsContainer">
        <div class="repeatWords__word">
          <div class="repeatWords__info">
            <p>Always</p>
            <p>Всегда</p>
            <p>[dsdsdwe]</p>
          </div>
          <p class="repeatWords__description">
            Description: It is used to show thing that happen very often
          </p>
          <div class="repeatWords_examples">
            <p>Examples:</p>
            <p>I always try to sleep</p>
            <p>I always eat my breakfast</p>
          </div>
          <p class="repeatWords__dateToRepeat">Следующее повторение: {{}}</p>
        </div>
        <div class="repeatWords__word">
          <div class="repeatWords__info">
            <p>Always</p>
            <p>Всегда</p>
            <p>[dsdsdwe]</p>
          </div>
          <p class="repeatWords__description">
            Description: It is used to show thing that happen very often
          </p>
          <div class="repeatWords_examples">
            <p>Examples:</p>
            <p>I always try to sleep</p>
            <p>I always eat my breakfast</p>
          </div>
          <p class="repeatWords__dateToRepeat">Следующее повторение: {{}}</p>
        </div>
        <div class="repeatWords__word">
          <div class="repeatWords__info">
            <p>Always</p>
            <p>Всегда</p>
            <p>[dsdsdwe]</p>
          </div>
          <p class="repeatWords__description">
            Description: It is used to show thing that happen very often
          </p>
          <div class="repeatWords_examples">
            <p>Examples:</p>
            <p>I always try to sleep</p>
            <p>I always eat my breakfast</p>
          </div>
          <p class="repeatWords__dateToRepeat">Следующее повторение: {{}}</p>
        </div>
      </div>
      <div class="repeatWords__startLearn">
        <button
          class="repeatWords__startButton normal red"
          @click="startLearn('standart')"
        >
          Обычный режим
        </button>
        <button
          class="repeatWords__startButton reverse red"
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
        nextRepeatUp: "По дате следующего повторения (по возрастанию)",
        nextRepeatDown: "По дате следующего повторения (по убыванию)",
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
};
</script>

<style></style>
