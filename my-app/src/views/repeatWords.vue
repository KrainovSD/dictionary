<template>
  <div class="learnPlace__container">
    <div class="repeatWords">
      <div class="repeatWords__header">
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
};
</script>

<style></style>
