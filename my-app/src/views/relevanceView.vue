<template>
  <div class="relevance">
    <div style="display: flex">
      <div style="position: relative; width: 45%">
        <textarea
          type="text"
          class="relevance__input textArea"
          :class="errorInput != '' ? '_error' : ''"
          placeholder="Внесите слова"
          name="input"
          maxlength="164"
          v-model="input"
          autocomplete="off"
        />
        <div
          class="relevance__tooltip"
          v-if="errorInput != '' && currentFocusInput == true"
          :tooltip="errorInput"
        ></div>
      </div>
      <div class="relevance__newInput">
        <p class="relevance__inputItem red">Glock - 1 (3)</p>
        <p class="relevance__inputItem green">Glock - 1 (3)</p>
        <p class="relevance__inputItem">Glock - 1 (3)</p>
      </div>
    </div>
    <div style="display: flex">
      <div style="display: flex; flex-direction: column; width: 45%">
        <button class="relevance__confirmInput">Внести</button>
        <p class="relevance__info">
          Для записи слов и дальнейшей проверке на актуальность, внесите слово
          или слова, используя в качестве разделителя знак запятой или точки с
          запятой, в текстовое поле. <br />
          С правой стороны слова выводятся с количеством встреч в течении месяца
          (первая цифра) и с общим количеством встреч с этим словом с момента
          записи слова (цифра в скобках). <br />
          Слова имеют три цвета при добавлении: зеленый - новое слово, черный -
          количество встреч не превысило минимум, красное - часто встречающееся
          вам слово.<br />
          Чтобы добавить слово, которое часто вам встречается, в любую категорию
          для дальнейшего изучения, выберите подходящее слово в окошке справа.
        </p>
        <button class="relevance__confirmAddWord">Добавить слово!</button>
      </div>
      <div
        style="
          display: flex;
          flex-direction: column;
          width: 50%;
          margin: 15px 0 0 auto;
        "
      >
        <div style="height: 52px; display: flex">
          <div class="relevance__containerFiler _close" ref="filter">
            <img
              src="@/assets/filter.png"
              alt=""
              class="relevance__filterIcon"
              @click="showFilter"
            />
            <div class="relevance__filter" v-if="filterVisible == true">
              {{ filterTitle }}
              <div class="relevance__subFilter _close" ref="subFilter">
                <p
                  class="relevance__filterItem"
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
              class="relevance__arrow"
              v-if="filterVisible == true"
              @click="showSubFilter"
              id="arrow"
              ref="arrow"
            />
          </div>
          <div class="relevance__searchContainer _close" ref="search">
            <img
              src="@/assets/search.png"
              alt=""
              class="relevance__searchIcon"
              @click="showSearch"
            />
            <input
              type="text"
              class="relevance__search"
              placeholder="Search"
              v-if="searching == true"
              v-model="search"
            />
          </div>
        </div>

        <div class="relevance__list">
          <p
            class="relevance__word"
            id="word"
            @click="selectWord"
            :class="currentSelectWord == 'word' ? '_select' : ''"
          >
            Flex - 1 (2)
          </p>
          <p class="relevance__word red">Flex - 1 (2)</p>
          <p class="relevance__word">Flex - 1 (2)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      errorInput: "",
      currentFocusInput: false,
      searching: false,
      search: "",
      filter: "letterUp",
      filterVisible: false,
      filterList: {
        letterUp: "По алфавиту от A до Z",
        letterDown: "По алфавиту от Z до A",
        countPerMonthUp: "По количеству встреч за месяц (по возрастанию)",
        countPerMonthDown: "По количеству встреч за месяц (по убыванию)",
        countPerBirthUp: "По общему количеству встреч (по возрастанию)",
        countPerBirthDown: "По общему количеству встреч (по убыванию)",
      },
      currentSelectWord: "",
    };
  },
  mounted() {
    let input = document.querySelector("textarea");
    input.addEventListener("focus", this.selectInput);
    input.addEventListener("focusout", this.unSelectInput);
  },
  beforeUnmount() {
    let input = document.querySelector("textarea");
    input.removeEventListener("focus", this.selectInput);
    input.removeEventListener("focusout", this.unSelectInput);
  },
  computed: {
    filterTitle() {
      return this.filterList[this.filter];
    },
  },
  methods: {
    selectInput(event) {
      let input = event.target;
      if (!input.classList.contains("_focus")) {
        input.classList.toggle("_focus");
        this.currentFocusInput = true;
      }
    },
    unSelectInput(event) {
      let input = event.target;
      if (input.classList.contains("_focus")) {
        input.classList.toggle("_focus");
        this.currentFocusInput = false;
      }
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
    selectWord(event) {
      let word = event.target.id;
      this.currentSelectWord = word;
    },
  },
};
</script>

<style></style>
