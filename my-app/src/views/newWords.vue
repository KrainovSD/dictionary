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
        <template v-if="userInfo?.categoriesToLearn?.length != 0">
          <div
            class="category"
            :class="[categoryColor(item), isSelectedCategory(item._id)]"
            :id="item._id"
            v-for="(item, index) in categoriesList"
            :key="index"
            @click="
              currentSelectedCategory =
                currentSelectedCategory?._id == item?._id ? {} : item
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
          @click="startLearn('learn')"
          :class="[standartModeButtonColor, isActiveCategory ? '' : 'disabled']"
          :disabled="isActiveCategory ? false : true"
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
            Object.keys(currentSelectedWord)?.length == 0
              ? 'disabled'
              : isWordInActiveCategory == true
              ? 'disabled'
              : ''
          "
          :disabled="
            Object.keys(currentSelectedWord)?.length == 0
              ? true
              : isWordInActiveCategory == true
              ? true
              : false
          "
          @click="deleteWord()"
        >
          Удалить
        </button>
      </div>
      <div class="newWords__list" @click.self="currentSelectedWord = {}">
        <div class="newWords__wordPlaceholder" v-if="wordsList?.length == 0">
          WORDS
        </div>
        <div v-else>
          <div
            class="newWords__word"
            v-for="(item, index) in wordsList"
            :class="[currentSelectedWord?._id == item._id ? 'selected' : '']"
            :key="index"
            :id="item._id"
            @click="
              currentSelectedWord =
                currentSelectedWord?._id == item._id ? {} : item
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
            <div class="newWords_examples" v-if="item.example?.length > 0">
              <p>Examples:</p>
              <p
                v-for="(itemExample, indexExample) in item.example"
                :key="indexExample"
              >
                {{ itemExample }}
              </p>
            </div>
            <div class="newWords__sub">
              <p>
                Количество ошибок, допущенных в слове: {{ item.wrongs }}
                {{ captionOfCountWrongs(item.wrongs) }}
              </p>
            </div>
          </div>
          <template v-if="isActiveCategory == true">
            <p>
              Осталось обычных повторений:
              {{ 13 - currentSelectedCategory.countOfRepeat }}
            </p>
            <p>
              Осталось реверсивных повторений:
              {{ 13 - currentSelectedCategory.countOfReverseRepeat }}
            </p>
            <p>
              Следующее обычное повторение:
              {{ currentSelectedCategory.infoNextRepeat }}
            </p>
            <p>
              Следующее реверсивное повторение:
              {{ currentSelectedCategory.infoNextReverseRepeat }}
            </p>
          </template>
        </div>
      </div>
      <p class="newWords__nameCategory">
        Выбранная категория: {{ selectedCaregory }}
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
      isLoading: false,
    };
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
    selectedCaregory() {
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
      wordsList = wordsList.map((item) => {
        let example = [];
        for (let itemExample of item.example) {
          if (itemExample == "") continue;
          example.push(itemExample);
        }
        return {
          _id: item._id,
          word: item.word,
          translate: item.translate,
          transcription: item.transcription,
          description: item.description,
          example,
          wrongs: item.wrongs,
          irregularVerb: item.irregularVerb,
          category: item.category,
        };
      });

      return wordsList;
    },
    standartModeButtonColor() {
      if (Object.keys(this.currentSelectedCategory)?.length == 0) return "";
      let now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      let index = this.userInfo.categoriesToLearn.findIndex(
        (item) => item._id == this.currentSelectedCategory._id
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
      if (Object.keys(this.currentSelectedCategory)?.length == 0) return "";
      let now = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
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
    captionOfCountWrongs(wrongs) {
      if (wrongs == 2 || wrongs == 3 || wrongs == 4) return "раза";
      return "раз";
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
        if (Object.keys(this.currentSelectedWord)?.length == 0) return;
        let id = this.currentSelectedWord?._id;

        let confirm = await this.showConfirm(
          "Удаление слова",
          "Вы уверены, что хотите удалить выбранное слово?"
        );
        if (!confirm) return;

        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = this.$store.getters.getAuth
          ? await this.$api.words.deleteWord(id)
          : this.$api.offline.deleteWord(id);

        this.isLoading = false;
        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          this.$api.offline.setSignatureAPI(userInfo);
        }
        let message = res?.data?.message || res?.message;
        await this.showInfo("Удаление слова", message);
      } catch (err) {
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
    async startLearn(type) {
      let categoryID = this.currentSelectedCategory._id;
      let words = this.userInfo.wordsToStudy.filter(
        (item) => item.category == categoryID && item?.offline != "delete"
      );
      words = words.sort(() => Math.random() - 0.5);
      this.learnCardVisible = true;
      await nextTick();
      this.$refs.learnCard.start(type, words, categoryID);
    },
  },
  watch: {
    currentSelectedCategory: {
      handler: function () {
        this.currentSelectedWord = {};
      },
      deep: true,
    },
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
  },
};
</script>

<style></style>
