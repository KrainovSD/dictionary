<template>
  <div class="learnPlace__container">
    <div class="knownWords">
      <div class="knownWords__header">
        <div class="knownWords__containerFiler _close" ref="filter">
          <img
            src="@/assets/filter.png"
            alt=""
            class="knownWords__filterIcon"
            @click="showFilter"
          />
          <div class="knownWords__filter" v-if="filterVisible == true">
            {{ filterTitle }}
            <div class="knownWords__subFilter _close" ref="subFilter">
              <p
                class="knownWords__filterItem"
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
            class="knownWords__arrow"
            v-if="filterVisible == true"
            @click="showSubFilter"
            id="arrow"
            ref="arrow"
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
        <button class="knownWords__startButton normal red">
          Обычный режим
        </button>
        <p>Количество слов повторяемых за раз: {{}}</p>
        <button class="knownWords__startButton reverse red">
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
        lastCommonRepeatUp:
          "По дате последнего повторения в обычном режиме (по возрастанию)",
        lastCommonRepeatDown:
          "По дате последнего повторения в обычном режиме (по убыванию)",
        lastReverseRepeatUp:
          "По дате последнего повторения в обратном режиме (по возрастанию)",
        lastReverseRepeatDown:
          "По дате последнего повторения в обратном режиме (по убыванию)",
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
  watch: {},
};
</script>

<style></style>
