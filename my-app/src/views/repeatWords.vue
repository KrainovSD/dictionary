<template>
  <div class="learnPlace__container">
    <div class="repeatWords">
      <div class="repeatWords__header">
        <div class="repeatWords__containerFiler _close" ref="filter">
          <img
            src="@/assets/filter.png"
            alt=""
            class="repeatWords__filterIcon"
            @click="showFilter"
          />
          <div class="repeatWords__filter" v-if="filterVisible == true">
            {{ filterTitle }}
            <div class="repeatWords__subFilter _close" ref="subFilter">
              <p
                class="repeatWords__filterItem"
                v-for="(item, index) in filterList"
                :key="index"
                :id="index"
                @click="
                  filter = index;
                  showSubFilter();
                "
              >
                {{ item }}
              </p>
            </div>
          </div>
          <img
            src="@/assets/arrowDown.png"
            alt=""
            class="repeatWords__arrow"
            v-if="filterVisible == true"
            @click="showSubFilter"
            id="arrow"
            ref="arrow"
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
        <button class="repeatWords__startButton normal red">
          Обычный режим
        </button>
        <button class="repeatWords__startButton reverse red">
          Обратный режим
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searching: false,
      search: "",
      filter: "letterUp",
      filterVisible: false,
      filterList: {
        letterUp: "По алфавиту от A до Z",
        letterDown: "По алфавиту от Z до A",
        nextRepeatUp: "По дате следующего повторения (по возрастанию)",
        nextRepeatDown: "По дате следующего повторения (по убыванию)",
      },
    };
  },
  computed: {
    filterTitle() {
      return this.filterList[this.filter];
    },
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
    showFilter() {
      let filter = this.$refs.filter;
      let subFilter = this.$refs.subFilter;
      let arrow = this.$refs.arrow;
      if (!filter.classList.contains("_close")) {
        if (!subFilter.classList.contains("_close")) {
          subFilter.classList.toggle("_close");
          arrow.classList.toggle("_active");
        }

        filter.classList.toggle("_close");
        this.filterVisible = false;

        return;
      }
      filter.classList.toggle("_close");
      setTimeout(() => {
        this.filterVisible = true;
      }, 200);
    },
    showSubFilter() {
      let subFilter = this.$refs.subFilter;
      let arrow = this.$refs.arrow;

      if (!subFilter?.classList?.contains("_close")) {
        subFilter.classList.toggle("_close");
        arrow.classList.toggle("_active");
        return;
      }
      subFilter.classList.toggle("_close");
      arrow.classList.toggle("_active");
    },
  },
};
</script>

<style></style>
