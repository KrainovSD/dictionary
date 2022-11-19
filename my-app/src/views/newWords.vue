<template>
  <word-popup
    v-if="wordPopupVisible == true"
    :wordPopupType="wordPopupType"
    @close="this.wordPopupVisible = false"
    @add="addWord"
    @update="updateWord"
  />
  <category-popup
    v-if="categoryPopupVisible == true"
    :categoryPopupType="categoryPopupType"
    @close="this.categoryPopupVisible = false"
    @add="addCategory"
    @update="updateCategory"
  />
  <learn-card
    :learnType="learnType"
    v-if="learnCardVisible == true"
    @close="learnCardVisible = false"
  />
  <div class="learnPlace__container">
    <div class="categories">
      <div class="CRUDpanel">
        <button
          class="CRUDpanel__toolsButton create"
          @click="openCategoryPopup('add')"
        >
          Добавить
        </button>
        <button
          class="CRUDpanel__toolsButton update"
          @click="openCategoryPopup('update')"
        >
          Редактировать
        </button>
        <button class="CRUDpanel__toolsButton delete">Удалить</button>
      </div>
      <div class="categories__list">
        <div class="category green" id="32">
          <img src="@/assets/email.png" alt="" class="category__icon" />
          <p class="category__name">My favourite words</p>
          <p class="category__countWords">words: 42{{}}</p>
        </div>
        <div class="category gray" id="32">
          <img src="@/assets/email.png" alt="" class="category__icon" />
          <p class="category__name">My favourite words</p>
          <p class="category__countWords">42{{}}</p>
        </div>
        <div class="category red" id="32">
          <img src="@/assets/email.png" alt="" class="category__icon" />
          <p class="category__name">My favourite words</p>
        </div>
        <div class="category" id="32">
          <img src="@/assets/email.png" alt="" class="category__icon" />
          <p class="category__name">My favourite words</p>
        </div>
        <div class="category green" id="32">
          <img src="@/assets/email.png" alt="" class="category__icon" />
          <p class="category__name">My favourite words</p>
        </div>
        <div class="category gray" id="32">
          <img src="@/assets/email.png" alt="" class="category__icon" />
          <p class="category__name">My favourite words</p>
        </div>
      </div>
      <div class="categories__startLearn">
        <button
          class="categories__startButton normal red"
          @click="startLearn('standart')"
        >
          Обычный режим
        </button>
        <button class="categories__startButton start">Начать учить</button>
        <button
          class="categories__startButton reverse red"
          @click="startLearn('reverse')"
        >
          Обратный режим
        </button>
      </div>
    </div>

    <div class="newWords">
      <div class="CRUDpanel reverse">
        <button
          class="CRUDpanel__toolsButton create reverse"
          @click="openWordPopup('add')"
        >
          Добавить
        </button>
        <div class="newWords__searchContainer _close" ref="search">
          <img
            src="@/assets/search.png"
            alt=""
            class="newWords__searchIcon"
            @click="showSearch"
          />
          <input
            type="text"
            class="newWords__search"
            placeholder="Search"
            v-if="searching == true"
            v-model="search"
          />
        </div>
        <button
          class="CRUDpanel__toolsButton update reverse"
          @click="openWordPopup('update')"
        >
          Редактировать
        </button>
        <button class="CRUDpanel__toolsButton delete reverse">Удалить</button>
      </div>
      <div class="newWords__list">
        <div class="newWords__word">
          <div class="newWords__info">
            <p>Always</p>
            <p>Всегда</p>
            <p>[dsdsdwe]</p>
          </div>
          <p class="newWords__description">
            Description: It is used to show thing that happen very often
          </p>
          <div class="newWords_examples">
            <p>Examples:</p>
            <p>I always try to sleep</p>
            <p>I always eat my breakfast</p>
          </div>
        </div>

        <div class="newWords__word">
          <div class="newWords__info">
            <p>Always</p>
            <p>Всегда</p>
            <p>[dsdsdwe]</p>
          </div>
          <p class="newWords__description">
            Description: It is used to show thing that happen very often
          </p>
          <div class="newWords_examples">
            <p>Examples:</p>
            <p>I always try to sleep</p>
            <p>I always eat my breakfast</p>
          </div>
        </div>

        <div class="newWords__word">
          <div class="newWords__info">
            <p>Always</p>
            <p>Всегда</p>
            <p>[dsdsdwe]</p>
          </div>
          <p class="newWords__description">
            Description: It is used to show thing that happen very often
          </p>
          <div class="newWords_examples">
            <p>Examples:</p>
            <p>I always try to sleep</p>
            <p>I always eat my breakfast</p>
          </div>
        </div>

        <div class="newWords__word">
          <div class="newWords__info">
            <p>Always</p>
            <p>Всегда</p>
            <p>[dsdsdwe]</p>
          </div>
          <p class="newWords__description">
            Description: It is used to show thing that happen very often
          </p>
          <div class="newWords_examples">
            <p>Examples:</p>
            <p>I always try to sleep</p>
            <p>I always eat my breakfast</p>
          </div>
        </div>

        <div class="newWords__word">
          <div class="newWords__info">
            <p>Always</p>
            <p>Всегда</p>
            <p>[dsdsdwe]</p>
          </div>
          <p class="newWords__description">
            Description: It is used to show thing that happen very often
          </p>
          <div class="newWords__examples">
            <p>Examples:</p>
            <p>I always try to sleep</p>
            <p>I always eat my breakfast</p>
          </div>
        </div>
      </div>
      <p class="newWords__nameCategory">Selected category</p>
    </div>
  </div>
</template>

<script>
import categoryPopup from "../components/categoryPopup";
import wordPopup from "../components/wordPopup";
import learnCard from "../components/learnCard";
export default {
  components: {
    categoryPopup,
    wordPopup,
    learnCard,
  },
  data() {
    return {
      selectedCategory: "",
      categoryPopupVisible: false,
      wordPopupVisible: false,
      wordPopupType: "",
      categoryPopupType: "",
      searching: false,
      search: "",
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
    openWordPopup(type) {
      this.wordPopupVisible = true;
      this.wordPopupType = type;
    },
    openCategoryPopup(type) {
      this.categoryPopupVisible = true;
      this.categoryPopupType = type;
    },
    addWord(payload) {
      console.log(payload);
    },
    updateWord() {},
    addCategory(payload) {
      console.log(payload);
    },
    updateCategory() {},
  },
};
</script>

<style></style>
