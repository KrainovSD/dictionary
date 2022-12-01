<template>
  <word-popup
    v-if="wordPopupVisible == true"
    :wordPopupType="wordPopupType"
    :options="wordPopupOptions"
    @close="this.wordPopupVisible = false"
  />
  <category-popup
    v-if="categoryPopupVisible == true"
    :categoryPopupType="categoryPopupType"
    :options="categoryPopupOptions"
    @close="this.categoryPopupVisible = false"
  />
  <learn-card
    :learnType="learnType"
    v-if="learnCardVisible == true"
    @close="learnCardVisible = false"
  />
  <info-popup ref="info" />
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
          :class="!isHaveCategory || isActiveCategory ? 'disabled' : ''"
          :disabled="!isHaveCategory || isActiveCategory ? true : false"
        >
          Редактировать
        </button>
        <button
          class="CRUDpanel__toolsButton delete"
          :class="!isHaveCategory ? 'disabled' : ''"
          :disabled="!isHaveCategory ? true : false"
        >
          Удалить
        </button>
      </div>
      <div class="categories__list" @click.self="currentSelectedCategory = {}">
        <div
          class="categories__categoryPlaceholder"
          v-if="userInfo?.categoriesToLearn?.length == 0"
        >
          Categories
        </div>
        <template v-if="userInfo?.categoriesToLearn?.length != 0">
          <div
            class="category"
            :class="[
              categoryColor(
                item.nextRepeat,
                item.nextReverseRepeat,
                item.startLearn
              ),
              isSelectedCategory(item._id),
            ]"
            :id="item._id"
            v-for="(item, index) in userInfo?.categoriesToLearn"
            :key="index"
            @click="
              currentSelectedCategory =
                currentSelectedCategory == item ? {} : item
            "
          >
            <img :src="categoryIcon(item.icon)" alt="" class="category__icon" />
            <p class="category__name">{{ item.name }}</p>
            <p class="category__countWords">
              words: {{ categoryCountWords(item._id) }}
            </p>
          </div>
        </template>
      </div>
      <div class="categories__startLearn">
        <button
          class="categories__startButton normal"
          @click="startLearn('standart')"
          :class="[standartModeButtonColor, isActiveCategory ? '' : 'disabled']"
          :disabled="isActiveCategory ? false : true"
        >
          Обычный режим
        </button>
        <button
          class="categories__startButton start"
          :class="
            isActiveCategory || !isHaveCategory || wordsList?.length == 0
              ? 'disabled'
              : ''
          "
          :disabled="
            isActiveCategory || !isHaveCategory || wordsList?.length == 0
              ? true
              : false
          "
          @click="startLearnCategory"
        >
          Начать учить
        </button>
        <button
          class="categories__startButton reverse"
          @click="startLearn('reverse')"
          :class="[reverseModeButtonColor, isActiveCategory ? '' : 'disabled']"
          :disabled="isActiveCategory ? false : true"
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
          :class="isActiveCategory ? 'disabled' : ''"
          :disabled="isActiveCategory ? true : false"
        >
          Добавить
        </button>
        <div class="newWords__searchContainer">
          <search-panel v-model="search" />
        </div>
        <button
          class="CRUDpanel__toolsButton update reverse"
          :class="
            Object.keys(currentSelectedWord)?.length == 0 ? 'disabled' : ''
          "
          @click="openWordPopup('update')"
          :disabled="
            Object.keys(currentSelectedWord)?.length == 0 ? true : false
          "
        >
          Редактировать
        </button>
        <button
          class="CRUDpanel__toolsButton delete reverse"
          :class="
            Object.keys(currentSelectedWord)?.length == 0 ? 'disabled' : ''
          "
          :disabled="
            Object.keys(currentSelectedWord)?.length == 0 ? true : false
          "
        >
          Удалить
        </button>
      </div>
      <div class="newWords__list" @click.self="currentSelectedWord = {}">
        <div class="newWords__wordPlaceholder" v-if="wordsList?.length == 0">
          WORDS
        </div>
        <div v-if="wordsList?.length != 0">
          <div
            class="newWords__word"
            :class="currentSelectedWord == item ? 'selected' : ''"
            v-for="(item, index) in wordsList"
            :key="index"
            @click="
              currentSelectedWord = currentSelectedWord == item ? {} : item
            "
          >
            <div class="newWords__info">
              <p>{{ item.word }}</p>
              <p>{{ item.translate }}</p>
              <p>{{ item.transcription }}</p>
            </div>
            <p class="newWords__description">
              Description: {{ item.description }}
            </p>
            <div class="newWords_examples">
              <p>Examples:</p>
              <p
                v-for="(itemExample, indexExample) in item.example"
                :key="indexExample"
              >
                {{ itemExample }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p class="newWords__nameCategory">
        Selected category: {{ selectedCaregory }}
      </p>
    </div>
  </div>
</template>

<script>
import categoryPopup from "../components/categoryPopup";
import wordPopup from "../components/wordPopup";
import learnCard from "../components/learnCard";
import searchPanel from "../components/searchPanel";
import infoPopup from "../components/infoPopup";
export default {
  components: {
    categoryPopup,
    wordPopup,
    learnCard,
    searchPanel,
    infoPopup,
  },
  data() {
    return {
      currentSelectedCategory: {},
      currentSelectedWord: {},
      categoryPopupVisible: false,
      wordPopupVisible: false,
      wordPopupType: "",
      categoryPopupType: "",
      wordPopupOptions: {},
      categoryPopupOptions: {},
      search: "",
      learnCardVisible: false,
      learnType: "standart",
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
    selectedCaregory() {
      if (Object.keys(this.currentSelectedCategory)?.length == 0) return "None";
      return this.currentSelectedCategory?.name;
    },
    isActiveCategory() {
      if (Object.keys(this.currentSelectedCategory)?.length == 0) return false;
      if (this.currentSelectedCategory?.startLearn == false) return false;
      return true;
    },
    isHaveCategory() {
      if (Object.keys(this.currentSelectedCategory)?.length == 0) return false;
      return true;
    },
    wordsList() {
      let wordsList = [];
      let words = this?.userInfo?.wordsToStudy;
      if (
        Object.keys(this.currentSelectedCategory)?.length == 0 ||
        !words ||
        words?.length == 0
      )
        return wordsList;
      wordsList = words.filter(
        (word) => word.category == this.currentSelectedCategory?._id
      );
      return wordsList;
    },
    standartModeButtonColor() {
      if (Object.keys(this.currentSelectedCategory)?.length == 0) return "";
      let now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      let nextRepeat = Math.floor(
        this.currentSelectedCategory?.nextRepeat / (1000 * 60 * 60 * 24)
      );
      if (now >= nextRepeat) return "red";
      return "green";
    },
    reverseModeButtonColor() {
      if (Object.keys(this.currentSelectedCategory)?.length == 0) return "";
      let now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      let nextReverseRepeat = Math.floor(
        this.currentSelectedCategory?.nextReverseRepeat / (1000 * 60 * 60 * 24)
      );
      if (now >= nextReverseRepeat) return "red";
      return "green";
    },
  },
  methods: {
    categoryIcon(icon) {
      return require(`../assets/category/${icon}.png`);
    },
    categoryCountWords(id) {
      let wordsList = [];
      let words = this?.userInfo?.wordsToStudy;
      if (!words || words?.length == 0) return wordsList.length;
      wordsList = words.filter((word) => word.category == id);
      return wordsList.length;
    },
    categoryColor(nextRepeat, nextReverseRepeat, startLearn) {
      if (!startLearn) return "gray";
      let now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      nextRepeat = Math.floor(nextRepeat / (1000 * 60 * 60 * 24));
      nextReverseRepeat = Math.floor(nextReverseRepeat / (1000 * 60 * 60 * 24));
      if (now >= nextRepeat || now >= nextReverseRepeat) return "red";
      return "green";
    },
    isSelectedCategory(id) {
      if (id == this.currentSelectedCategory?._id) return "selected";
      return "";
    },
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
    },
    startLearn(type) {
      this.learnType = type;
      this.learnCardVisible = true;
    },
    openWordPopup(type) {
      this.wordPopupOptions = {};
      if (Object.keys(this.currentSelectedCategory)?.length > 0)
        this.wordPopupOptions.category = this.currentSelectedCategory._id;
      if (type == "update") {
        if (Object.keys(this.currentSelectedWord)?.length == 0) return;
        this.wordPopupOptions.word = this.currentSelectedWord?.word;
        this.wordPopupOptions.translate = this.currentSelectedWord?.translate;
        this.wordPopupOptions.transcription =
          this.currentSelectedWord?.transcription;
        this.wordPopupOptions.description =
          this.currentSelectedWord?.description;
        this.wordPopupOptions.example = this.currentSelectedWord?.example;
        this.wordPopupOptions.id = this.currentSelectedWord?._id;
      }
      this.wordPopupVisible = true;
      this.wordPopupType = type;
    },
    openCategoryPopup(type) {
      this.categoryPopupOptions = {};
      if (type == "update") {
        if (Object.keys(this.currentSelectedCategory)?.length == 0) return;
        this.categoryPopupOptions.id = this.currentSelectedCategory?._id;
        this.categoryPopupOptions.name = this.currentSelectedCategory?.name;
        this.categoryPopupOptions.icon = this.currentSelectedCategory?.icon;
        this.categoryPopupOptions.regularityToRepeat =
          this.currentSelectedCategory?.regularityToRepeat;
      }
      this.categoryPopupVisible = true;
      this.categoryPopupType = type;
    },
    async startLearnCategory() {
      try {
        if (Object.keys(this.currentSelectedCategory)?.length == 0) return;
        let form = {
          id: this.currentSelectedCategory?._id,
        };
        let res = await this.$api.words.startLearnCategory(form);
        this.$store.commit("setUserInfo", res?.data?.user);
        this.showInfo("Change category status", res?.data?.message);
      } catch (err) {
        this.showInfo("Change category status", err?.response?.data?.message);
      }
    },
  },
  watch: {
    currentSelectedCategory: {
      handler: function () {
        this.currentSelectedWord = {};
      },
      deep: true,
    },
  },
};
</script>

<style></style>
