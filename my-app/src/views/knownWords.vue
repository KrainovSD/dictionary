<template>
  <div class="learnPlace__container">
    <div class="knownWords">
      <div class="knownWords__header">
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
  },
  watch: {},
};
</script>

<style></style>
