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
    v-if="learnCardVisible == true"
    ref="learnCard"
    @close="learnCardVisible = false"
  />
  <info-popup ref="info" />
  <confirm-popup ref="confirm" />
  <loading-popup v-if="isLoading == true" />
  <div class="newWords__workPlace appearVision" ref="workPlace">
    <div class="mobileSearchContainer">
      <search-panel v-model="search" />
    </div>
    <div
      class="addButtonMobile"
      ref="addButtonMobile"
      @click="
        this.$refs.workPlace.classList.contains('_openWordList')
          ? openWordPopup('add')
          : openCategoryPopup('add')
      "
    >
      Добавить
    </div>
    <!-- CATEGORY -->
    <div class="categories">
      <div class="categories__startLearn mobile">
        <button
          class="categories__startButton normal"
          @click="startLearn('learn')"
          :class="[
            standartModeButtonColor,
            isActiveCategory
              ? ''
              : Object.keys(currentSelectedCategory).length == 0 &&
                isCategoryReadyToRepeat
              ? ''
              : 'disabled',
          ]"
          :disabled="
            isActiveCategory
              ? false
              : Object.keys(currentSelectedCategory).length == 0 &&
                isCategoryReadyToRepeat
              ? false
              : true
          "
        >
          Обычный режим
        </button>
        <button
          class="categories__startButton reverse"
          @click="startLearn('reLearn')"
          :class="[
            reverseModeButtonColor,
            isActiveCategory
              ? ''
              : Object.keys(currentSelectedCategory).length == 0 &&
                isCategoryReadyToReverseRepeat
              ? ''
              : 'disabled',
          ]"
          :disabled="
            isActiveCategory
              ? false
              : Object.keys(currentSelectedCategory).length == 0 &&
                isCategoryReadyToReverseRepeat
              ? false
              : true
          "
        >
          Обратный режим
        </button>
      </div>
      <div class="CRUDpanel" ref="CRUD">
        <button
          class="CRUDpanel__toolsButton start"
          :class="
            isActiveCategory ||
            !isHaveCategory ||
            wordsList?.length < $options.countWordsToActiveCategory
              ? 'disabled'
              : ''
          "
          :disabled="
            isActiveCategory ||
            !isHaveCategory ||
            wordsList?.length < $options.countWordsToActiveCategory
              ? true
              : false
          "
          @click="startLearnCategory()"
        >
          Начать учить
        </button>
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
          @click="deleteCategory()"
        >
          Удалить
        </button>
      </div>
      <div class="categories__list" @click.self="currentSelectedCategory = {}">
        <div
          class="categories__categoryPlaceholder"
          v-if="
            userInfo?.categoriesToLearn?.length == 0 ||
            !userInfo?.categoriesToLearn
          "
        >
          Categories
        </div>
        <template v-else>
          <div
            class="category"
            :class="[categoryColor(item), isSelectedCategory(item._id)]"
            :id="item._id"
            v-for="(item, index) in categoriesList"
            :key="index"
            @click="
              currentSelectedCategory =
                currentSelectedCategory._id == item._id ? {} : item;
              isActiveCategory ||
              Object.keys(currentSelectedCategory).length == 0
                ? ''
                : openWordsListMobile();
            "
          >
            <div class="category__infoContainer">
              <img
                :src="categoryIcon(item.icon)"
                alt=""
                class="category__icon"
              />
              <p class="category__name">{{ item.name }}</p>
              <p class="category__countWords">
                words: {{ categoryCountWords(item._id) }}
              </p>
            </div>
            <div
              class="category__footer"
              v-if="
                isActiveCategory == true &&
                currentSelectedCategory._id == item._id
              "
            >
              <div class="category__subInfoContainer">
                <p><b>Info:</b></p>
                <p>
                  Осталось обычных повторений:
                  {{ 13 - item.countOfRepeat }}
                </p>
                <p>
                  Осталось реверсивных повторений:
                  {{ 13 - item.countOfReverseRepeat }}
                </p>
                <p>
                  Следующее обычное повторение:
                  {{ item.infoNextRepeat }}
                </p>
                <p>
                  Следующее реверсивное повторение:
                  {{ item.infoNextReverseRepeat }}
                </p>
              </div>
              <img
                src="@/assets/play.png"
                alt=""
                class="category__enter"
                @click.stop="openWordsListMobile"
              />
            </div>
          </div>
        </template>
      </div>
      <div class="categories__startLearn">
        <button
          class="categories__startButton normal"
          @click="startLearn('learn')"
          :class="[
            standartModeButtonColor,
            isActiveCategory
              ? ''
              : Object.keys(currentSelectedCategory).length == 0 &&
                isCategoryReadyToRepeat
              ? ''
              : 'disabled',
          ]"
          :disabled="
            isActiveCategory
              ? false
              : Object.keys(currentSelectedCategory).length == 0 &&
                isCategoryReadyToRepeat
              ? false
              : true
          "
        >
          Обычный режим
        </button>
        <button
          class="categories__startButton start"
          :class="
            isActiveCategory ||
            !isHaveCategory ||
            wordsList?.length < $options.countWordsToActiveCategory
              ? 'disabled'
              : ''
          "
          :disabled="
            isActiveCategory ||
            !isHaveCategory ||
            wordsList?.length < $options.countWordsToActiveCategory
              ? true
              : false
          "
          @click="startLearnCategory()"
        >
          Начать учить
        </button>
        <button
          class="categories__startButton reverse"
          @click="startLearn('reLearn')"
          :class="[
            reverseModeButtonColor,
            isActiveCategory
              ? ''
              : Object.keys(currentSelectedCategory).length == 0 &&
                isCategoryReadyToReverseRepeat
              ? ''
              : 'disabled',
          ]"
          :disabled="
            isActiveCategory
              ? false
              : Object.keys(currentSelectedCategory).length == 0 &&
                isCategoryReadyToReverseRepeat
              ? false
              : true
          "
        >
          Обратный режим
        </button>
      </div>
    </div>
    <!-- WORDS -->
    <div class="newWords__categoryInfoMobile" ref="categoryInfoMobile">
      <img
        src="@/assets/back.png"
        alt=""
        class="newWords__backMobile"
        v-if="currentMultiSelectedWords.length == 0"
        @click="
          closeWordsListMobile();
          this.currentSelectedCategory = {};
          this.search = '';
        "
      />
      <img
        src="@/assets/cancel.png"
        alt=""
        class="newWords__cancelMobile"
        v-if="currentMultiSelectedWords.length > 0"
        @click="this.currentMultiSelectedWords = []"
      />

      <p class="newWords__selectedCategoryMobile">
        <b>{{ selectedCategory }}</b>
      </p>
      <img
        src="@/assets/pointMenu.png"
        alt=""
        class="newWords__CRUDmobile"
        v-if="currentMultiSelectedWords.length == 0"
        @click="this.$refs.CRUD.classList.toggle('_active')"
      />
      <img
        src="@/assets/delete.png"
        alt=""
        v-if="currentMultiSelectedWords.length > 0"
        class="newWords__deleteMobile"
        @click="deleteWord"
      />
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
            Object.keys(currentSelectedWord)?.length == 0
              ? currentMultiSelectedWords.length > 0
                ? ''
                : 'disabled'
              : isWordInActiveCategory == true
              ? 'disabled'
              : ''
          "
          :disabled="
            Object.keys(currentSelectedWord)?.length == 0
              ? currentMultiSelectedWords.length > 0
                ? false
                : true
              : isWordInActiveCategory == true
              ? true
              : false
          "
          @click="deleteWord()"
        >
          Удалить
        </button>
      </div>
      <!-- WORD LIST -->
      <div class="newWords__wordContainer">
        <word-card
          :wordsList="wordsList"
          :currentMultiSelectedWords="currentMultiSelectedWords"
          @changeCurrentSelectedWord="
            (payload) => (currentSelectedWordID = payload)
          "
          @changeMultiSelected="
            (payload) => (currentMultiSelectedWords = payload)
          "
          @update="
            (payload) => {
              currentSelectedWordID = payload;
              openWordPopup('update');
            }
          "
          @delete="
            (payload) => {
              currentSelectedWordID = payload;
              deleteWord();
            }
          "
        />
      </div>
      <p class="newWords__categoryInfo">
        Выбранная категория: {{ selectedCategory }}
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
import confirmPopup from "../components/confirmPopup";
import loadingPopup from "../components/loadingPopup.vue";
import wordCard from "../components/wordCard";
import { nextTick } from "@vue/runtime-core";
export default {
  countWordsToActiveCategory: 2,
  components: {
    categoryPopup,
    wordPopup,
    learnCard,
    searchPanel,
    infoPopup,
    confirmPopup,
    loadingPopup,
    wordCard,
  },
  data() {
    return {
      currentSelectedCategory: {},
      currentSelectedWordID: "",
      currentMultiSelectedWords: [],
      categoryPopupVisible: false,
      wordPopupVisible: false,
      wordPopupType: "",
      categoryPopupType: "",
      wordPopupOptions: {},
      categoryPopupOptions: {},
      search: "",
      learnCardVisible: false,
      isLoading: false,
      scrollPosition: 0,
      categoryInfoMobileOffSetHeight: 0,
    };
  },

  categoryInfoMobileTop: null,
  mounted() {
    let categoryInfoMobile = this.$refs.categoryInfoMobile;
    let { top } = this.getCoords(categoryInfoMobile);
    this.$options.categoryInfoMobileTop = top;

    window.addEventListener("wheel", this.toggleAddButtonMobile);
    window.addEventListener("touchmove", this.toggleAddButtonMobileTouch);
    window.addEventListener("scroll", this.toggleFixedMobileItems);
  },
  beforeUnmount() {
    window.removeEventListener("wheel", this.toggleAddButtonMobile);
    window.removeEventListener("touchmove", this.toggleAddButtonMobileTouch);
    window.removeEventListener("scroll", this.toggleFixedMobileItems);
  },

  computed: {
    userInfo() {
      let userInfo = this.$store.getters.getUserInfo;
      if (Object.keys(userInfo)?.length == 0) {
        userInfo = this.$api.offline.getUserInfo();
      }
      return userInfo;
    },
    categoriesList() {
      let categories = this?.userInfo?.categoriesToLearn;
      categories = categories.filter((item) => item?.offline != "delete");
      categories = categories.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      for (let category of categories) {
        let infoNextRepeat =
          category.nextRepeat == 0
            ? "Сегодня"
            : Math.floor(category.nextRepeat / (1000 * 60 * 60 * 24)) -
                Math.floor(Date.now() / (1000 * 60 * 60 * 24)) >
              100
            ? "Никогда"
            : this.dateFormatter(category.nextRepeat);
        let infoNextReverseRepeat =
          category.nextReverseRepeat == 0
            ? "Сегодня"
            : Math.floor(category.nextReverseRepeat / (1000 * 60 * 60 * 24)) -
                Math.floor(Date.now() / (1000 * 60 * 60 * 24)) >
              50
            ? "Никогда"
            : this.dateFormatter(category.nextReverseRepeat);

        category.infoNextRepeat = infoNextRepeat;
        category.infoNextReverseRepeat = infoNextReverseRepeat;
      }
      return categories;
    },
    selectedCategory() {
      if (Object.keys(this?.currentSelectedCategory)?.length == 0)
        return "не выбрана";
      return this.currentSelectedCategory?.name;
    },
    isActiveCategory() {
      if (Object.keys(this?.currentSelectedCategory)?.length == 0) return false;
      if (this.currentSelectedCategory?.startLearn == false) return false;
      let index = this.userInfo.categoriesToLearn.findIndex(
        (item) =>
          item._id == this.currentSelectedCategory._id &&
          item?.offline != "delete"
      );
      if (index == -1) {
        return false;
      }
      return true;
    },
    isHaveCategory() {
      if (Object.keys(this?.currentSelectedCategory)?.length == 0) return false;
      let index = this.userInfo.categoriesToLearn.findIndex(
        (item) =>
          item._id == this.currentSelectedCategory._id &&
          item?.offline != "delete"
      );
      if (index == -1) {
        return false;
      }
      return true;
    },
    isCategoryReadyToRepeat() {
      let categories = this.userInfo.categoriesToLearn.filter(
        (item) => item.offline != "delete" && item.startLearn == true
      );
      let readyCategories = [];
      const now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      for (let category of categories) {
        let nextRepeat = Math.floor(
          category.nextRepeat / (1000 * 60 * 60 * 24)
        );

        if (nextRepeat == now || nextRepeat < now)
          readyCategories.push(category);
      }
      if (readyCategories.length > 0) return true;
      return false;
    },
    isCategoryReadyToReverseRepeat() {
      let categories = this.userInfo.categoriesToLearn.filter(
        (item) => item.offline != "delete" && item.startLearn == true
      );
      let readyCategories = [];
      const now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      for (let category of categories) {
        let nextReverseRepeat = Math.floor(
          category.nextReverseRepeat / (1000 * 60 * 60 * 24)
        );

        if (nextReverseRepeat == now || nextReverseRepeat < now)
          readyCategories.push(category);
      }
      if (readyCategories.length > 0) return true;
      return false;
    },
    currentSelectedWord() {
      if (this.currentSelectedWordID == "") return {};
      let index = this.wordsList.findIndex(
        (item) => item._id == this.currentSelectedWordID
      );
      if (index == -1) return {};
      let currentSelectedWord = this.wordsList[index];
      return currentSelectedWord;
    },
    isWordInActiveCategory() {
      if (Object.keys(this?.currentSelectedWord)?.length == 0) return false;
      let index = this.userInfo.categoriesToLearn.findIndex(
        (item) => item._id == this.currentSelectedWord.category
      );
      if (index == -1) return false;
      let category = this.userInfo.categoriesToLearn[index];
      if (category?.startLearn == true) return true;
      return false;
    },
    wordsList() {
      /* Сделать сортировку по алфавиту или даже сортировку в целом */
      let wordsList = this?.userInfo?.wordsToStudy;
      if (
        !wordsList ||
        wordsList?.length == 0 ||
        (Object.keys(this.currentSelectedCategory)?.length == 0 &&
          this.search?.length == 0)
      )
        return [];
      wordsList = wordsList.filter((item) => item?.offline != "delete");
      /* sort */
      wordsList = wordsList.sort((a, b) => {
        if (a.word < b.word) return -1;
        if (a.word > b.word) return 1;
        return 0;
      });
      /* filter */
      if (this.search?.length != 0 && this.search != "*") {
        let reg = new RegExp(this.search);
        wordsList = wordsList.filter(
          (item) => reg.test(item.word) || reg.test(item.translate)
        );
      }
      /* category */
      if (Object.keys(this.currentSelectedCategory)?.length != 0)
        wordsList = wordsList.filter(
          (word) => word.category == this.currentSelectedCategory?._id
        );

      let categories = this.userInfo.categoriesToLearn.filter(
        (item) => item.offline != "delete"
      );

      let nameCategoryList = {};
      for (let category of categories) {
        nameCategoryList[category._id] = category.name;
      }

      let activeCategoryList = categories.filter(
        (item) => item.startLearn == true
      );
      activeCategoryList = activeCategoryList.map((item) => item._id);

      wordsList = wordsList.map((item) => {
        let infoExample = [];
        for (let itemExample of item.example) {
          if (itemExample == "") continue;
          infoExample.push(itemExample);
        }
        let infoCategory = nameCategoryList[item.category];
        let infoMultiSelect = !activeCategoryList.includes(item.category);
        return {
          _id: item._id,
          word: item.word,
          translate: item.translate,
          transcription: item.transcription,
          description: item.description,
          example: item.example,
          wrongs: item.wrongs,
          irregularVerb: item.irregularVerb,
          category: item.category,
          infoExample,
          infoCategory,
          infoMultiSelect,
        };
      });

      return wordsList;
    },

    standartModeButtonColor() {
      const now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      if (Object.keys(this.currentSelectedCategory)?.length == 0) {
        let categories = this.userInfo.categoriesToLearn.filter(
          (item) => item.offline != "delete" && item.startLearn == true
        );
        let red = false;
        let yellow = false;
        for (let category of categories) {
          let nextRepeat = Math.floor(
            category.nextRepeat / (1000 * 60 * 60 * 24)
          );
          let dateOfStartLearn = Math.floor(
            category.dateOfStartLearn / (1000 * 60 * 60 * 24)
          );
          if (nextRepeat == now) yellow = true;
          if (nextRepeat < now) {
            if (now - dateOfStartLearn <= 1) yellow = true;
            else red = true;
          }
        }
        if (red) return "red";
        if (yellow) return "yellow";
        return "";
      }

      let index = this.userInfo.categoriesToLearn.findIndex(
        (item) =>
          item._id == this.currentSelectedCategory._id &&
          item.startLearn == true
      );
      if (index == -1) {
        return "";
      }
      let nextRepeat = Math.floor(
        this.userInfo.categoriesToLearn[index]?.nextRepeat /
          (1000 * 60 * 60 * 24)
      );
      let dateOfStartLearn = Math.floor(
        this.userInfo.categoriesToLearn[index]?.dateOfStartLearn /
          (1000 * 60 * 60 * 24)
      );

      if (nextRepeat == now) return "yellow";
      if (nextRepeat < now) {
        if (now - dateOfStartLearn <= 1) return "yellow";
        return "red";
      }
      return "green";
    },
    reverseModeButtonColor() {
      const now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      if (Object.keys(this.currentSelectedCategory)?.length == 0) {
        let categories = this.userInfo.categoriesToLearn.filter(
          (item) => item.offline != "delete" && item.startLearn == true
        );
        let red = false;
        let yellow = false;
        for (let category of categories) {
          let nextReverseRepeat = Math.floor(
            category.nextReverseRepeat / (1000 * 60 * 60 * 24)
          );
          let dateOfStartLearn = Math.floor(
            category.dateOfStartLearn / (1000 * 60 * 60 * 24)
          );

          if (nextReverseRepeat == now) yellow = true;
          if (nextReverseRepeat < now) {
            if (now - dateOfStartLearn <= 1) yellow = true;
            else red = true;
          }
        }
        if (red) return "red";
        if (yellow) return "yellow";
        return "";
      }
      let index = this.userInfo.categoriesToLearn.findIndex(
        (item) => item._id == this.currentSelectedCategory._id
      );
      if (index == -1) {
        return "";
      }
      let nextReverseRepeat = Math.floor(
        this.userInfo.categoriesToLearn[index]?.nextReverseRepeat /
          (1000 * 60 * 60 * 24)
      );
      let dateOfStartLearn = Math.floor(
        this.userInfo.categoriesToLearn[index]?.dateOfStartLearn /
          (1000 * 60 * 60 * 24)
      );

      if (nextReverseRepeat == now) return "yellow";
      if (nextReverseRepeat < now) {
        if (now - dateOfStartLearn <= 1) return "yellow";
        return "red";
      }
      return "green";
    },
  },
  methods: {
    toggleAddButtonMobile(e) {
      if (window.innerWidth > 1023) return;
      let delta = e.deltaY;
      let button = this.$refs.addButtonMobile;
      if (delta < 0 && button.classList.contains("_hidden")) {
        button.classList.remove("_hidden");
      } else if (delta > 0 && !button.classList.contains("_hidden")) {
        button.classList.add("_hidden");
      }
    },
    toggleAddButtonMobileTouch(e) {
      if (window.innerWidth > 1023) return;
      let button = this.$refs.addButtonMobile;
      let currentPosition = e.changedTouches[0].clientY;
      if (
        this.scrollPosition < currentPosition &&
        button.classList.contains("_hidden")
      ) {
        button.classList.remove("_hidden");
      } else if (
        this.scrollPosition > currentPosition &&
        !button.classList.contains("_hidden")
      ) {
        button.classList.add("_hidden");
      }

      this.scrollPosition = currentPosition;
    },
    openWordsListMobile() {
      this.$refs.workPlace.classList.add("_openWordList");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    closeWordsListMobile() {
      this.$refs.workPlace.classList.remove("_openWordList");
      this.$refs.CRUD.classList.remove("_active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    getCoords(elem) {
      let box = elem.getBoundingClientRect();
      return {
        top: box.top + scrollY,
        left: box.left + scrollX,
        right: box.right + scrollX,
        bottom: box.bottom + scrollY,
      };
    },
    toggleFixedMobileItems() {
      let categoryInfoMobile = this.$refs.categoryInfoMobile;
      let CRUD = this.$refs.CRUD;
      if (
        window.innerWidth > 1023 ||
        !this.$refs.workPlace.classList.contains("_openWordList")
      )
        return;
      let objectTop = this.$options.categoryInfoMobileTop;
      const headerHeight = 65;
      const pageTop = window.scrollY + headerHeight;
      if (
        objectTop > pageTop &&
        categoryInfoMobile.classList.contains("_fixed")
      ) {
        CRUD.classList.remove("_fixed");
        categoryInfoMobile.classList.remove("_fixed");
      } else if (
        objectTop <= pageTop &&
        !categoryInfoMobile.classList.contains("_fixed")
      ) {
        CRUD.classList.add("_fixed");
        categoryInfoMobile.classList.add("_fixed");
      }
    },
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
    categoryIcon(icon) {
      return require(`../assets/category/${icon}.png`);
    },
    categoryCountWords(id) {
      let wordsList = [];
      let words = this?.userInfo?.wordsToStudy;
      if (!words || words?.length == 0) return wordsList.length;
      wordsList = words.filter(
        (word) => word.category == id && word?.offline != "delete"
      );
      return wordsList.length;
    },
    categoryColor(category) {
      if (!category.startLearn) return "gray";
      let now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      let dateOfStartLearn = Math.floor(
        category.dateOfStartLearn / (1000 * 60 * 60 * 24)
      );
      let nextRepeat = Math.floor(category.nextRepeat / (1000 * 60 * 60 * 24));
      let nextReverseRepeat = Math.floor(
        category.nextReverseRepeat / (1000 * 60 * 60 * 24)
      );
      if (nextRepeat == now || nextReverseRepeat == now) return "yellow";
      if (nextRepeat < now || nextReverseRepeat < now) {
        if (now - dateOfStartLearn <= 1) return "yellow";
        return "red";
      }
      return "green";
    },
    isSelectedCategory(id) {
      if (id == this.currentSelectedCategory?._id) return "selected";
      return "";
    },
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
    },
    async showConfirm(header, title) {
      let confirm = await this.$refs.confirm.show(header, title);
      return confirm;
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
      if (type == "update")
        this.categoryPopupOptions = this.currentSelectedCategory;
      this.categoryPopupVisible = true;
      this.categoryPopupType = type;
    },
    async startLearnCategory() {
      try {
        if (Object.keys(this.currentSelectedCategory)?.length == 0) return;
        let form = {
          id: this.currentSelectedCategory?._id,
        };
        let confirm = await this.showConfirm(
          "Изменение статуса категории",
          "Вы уверены, что хотите начать изучать категорию? Если вы измените статус, вы больше не сможете редактировать категорию и добавлять в нее новые слова!"
        );
        if (!confirm) return;

        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = this.$store.getters.getAuth
          ? await this.$api.words.startLearnCategory(form)
          : this.$api.offline.startLearnCategory(form);

        this.isLoading = false;
        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          this.$api.offline.setSignatureAPI(userInfo);
        }
        let message = res?.data?.message || res?.message;
        await this.showInfo("Изменения статуса категории", message);
        this.currentSelectedCategory = {};
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        let status = err?.response?.status;
        this.isLoading = false;
        if (status == 0 || status == 500) {
          message =
            "Сервер не отвечает или интернет соединение утеряно, переводим операции в режим оффлайн, выполните операцию повторно!";
          this.$store.commit("resetAuth");
        }
        this.showInfo("Изменения статуса категории", message);
      }
    },
    async deleteCategory() {
      try {
        if (Object.keys(this.currentSelectedCategory)?.length == 0) return;
        let id = this.currentSelectedCategory?._id;
        let confirm = await this.showConfirm(
          "Удаление категории",
          "Вы уверены, что хотите удалить выбранную категорию? Весь прогресс изучения слов из категории будет утерян, а слова будут удалены!"
        );
        if (!confirm) return;

        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = this.$store.getters.getAuth
          ? await this.$api.words.deleteCategory(id)
          : this.$api.offline.deleteCategory(id);

        this.isLoading = false;
        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          this.$api.offline.setSignatureAPI(userInfo);
        }
        let message = res?.data?.message || res?.message;
        await this.showInfo("Удаление категории", message);
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        let status = err?.response?.status;
        this.isLoading = false;
        if (status == 0 || status == 500) {
          message =
            "Сервер не отвечает или интернет соединение утеряно, переводим операции в режим оффлайн, выполните операцию повторно!";
          this.$store.commit("resetAuth");
        }
        this.showInfo("Удаление категории", message);
      }
    },
    async deleteWord() {
      try {
        let id;
        if (this.currentSelectedWordID == "") {
          id = this.currentMultiSelectedWords;
          let confirm = await this.showConfirm(
            "Удаление слова",
            "Вы уверены, что хотите удалить выбранные слова?"
          );
          if (!confirm) return;
        } else {
          id = [this.currentSelectedWordID];

          let confirm = await this.showConfirm(
            "Удаление слова",
            "Вы уверены, что хотите удалить выбранное слово?"
          );
          if (!confirm) return;
        }
        this.currentMultiSelectedWords = [];

        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = this.$store.getters.getAuth
          ? await this.$api.words.multipleDeleteWord({ id })
          : this.$api.offline.multipleDeleteWord({ id });

        this.isLoading = false;
        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          this.$api.offline.setSignatureAPI(userInfo);
        }
        let message = res?.data?.message || res?.message;
        await this.showInfo("Удаление слова", message);
      } catch (err) {
        console.log(err);
        let message = err?.response?.data?.message || err?.message;
        let status = err?.response?.status;
        this.isLoading = false;
        if (status == 0 || status == 500) {
          message =
            "Сервер не отвечает или интернет соединение утеряно, переводим операции в режим оффлайн, выполните операцию повторно!";
          this.$store.commit("resetAuth");
        }
        this.showInfo("Удаление слова", message);
      }
    },
    getReadyCategoryToRepeat() {
      let categories = this.userInfo.categoriesToLearn.filter(
        (item) => item.offline != "delete" && item.startLearn == true
      );
      let readyCategories = [];
      const now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      for (let category of categories) {
        let nextRepeat = Math.floor(
          category.nextRepeat / (1000 * 60 * 60 * 24)
        );

        if (nextRepeat == now || nextRepeat < now)
          readyCategories.push(category);
      }
      readyCategories = readyCategories.map((item) => item._id);
      if (readyCategories.length > 0) return readyCategories;
      return [];
    },
    getReadyCategoryToReverseRepeat() {
      let categories = this.userInfo.categoriesToLearn.filter(
        (item) => item.offline != "delete" && item.startLearn == true
      );
      let readyCategories = [];
      const now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      for (let category of categories) {
        let nextReverseRepeat = Math.floor(
          category.nextReverseRepeat / (1000 * 60 * 60 * 24)
        );

        if (nextReverseRepeat == now || nextReverseRepeat < now)
          readyCategories.push(category);
      }
      readyCategories = readyCategories.map((item) => item._id);
      if (readyCategories.length > 0) return readyCategories;
      return [];
    },
    async startLearn(type) {
      let allCategoriesToRepeat =
        type == "learn"
          ? this.getReadyCategoryToRepeat()
          : this.getReadyCategoryToReverseRepeat();
      let categoryID = [];
      this.currentSelectedCategory._id
        ? categoryID.push(this.currentSelectedCategory._id)
        : categoryID.push(...allCategoriesToRepeat);
      if (categoryID.length == 0) return;

      let words = this.userInfo.wordsToStudy.filter(
        (item) =>
          categoryID.includes(item.category) && item?.offline != "delete"
      );
      words = words.sort(() => Math.random() - 0.5);
      this.learnCardVisible = true;
      await nextTick();
      this.$refs.learnCard.start(type, words, categoryID);
    },
  },
  watch: {
    userInfo() {
      if (Object.keys(this.currentSelectedCategory)?.length == 0) return;
      let index = this.userInfo.categoriesToLearn.findIndex(
        (item) =>
          item._id == this.currentSelectedCategory._id &&
          item?.offline != "delete"
      );
      if (index == -1) {
        this.currentSelectedCategory = {};
        return;
      }
      this.currentSelectedCategory = this.userInfo.categoriesToLearn[index];
    },
    search() {
      let workPlace = this.$refs.workPlace;
      if (
        this.search.trim() != "" &&
        !workPlace.classList.contains("_openWordList")
      )
        this.openWordsListMobile();
      else if (
        this.search.trim() == "" &&
        workPlace.classList.contains("_openWordList") &&
        Object.keys(this.currentSelectedCategory).length == 0
      )
        this.closeWordsListMobile();
    },
  },
};
</script>

<style></style>
