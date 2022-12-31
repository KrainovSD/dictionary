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
            :class="[
              categoryColor(
                item.nextRepeat,
                item.nextReverseRepeat,
                item.startLearn
              ),
              isSelectedCategory(item._id),
            ]"
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
            Object.keys(currentSelectedWord)?.length == 0 ? 'disabled' : ''
          "
          :disabled="
            Object.keys(currentSelectedWord)?.length == 0 ? true : false
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
                {{ caseOfCount(item.wrongs) }}
              </p>
            </div>
          </div>
          <p>
            Осталось обычных повторений:
            {{ 13 - currentSelectedCategory.countOfRepeat }}
          </p>
          <p>
            Осталось реверсивных повторений:
            {{ 13 - currentSelectedCategory.countOfReverseRepeat }}
          </p>
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
    };
  },

  computed: {
    userInfo() {
      let userInfo = this.$store.getters.getUserInfo;
      if (Object.keys(userInfo)?.length == 0) {
        userInfo = this.getUserInfoFromLocalStorage();
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
          description: item.transcription,
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
      if (now >= nextRepeat) return "red";
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
      if (now >= nextReverseRepeat) return "red";
      return "green";
    },
  },
  methods: {
    getUserInfoFromLocalStorage() {
      try {
        let userInfo = {};
        let info = JSON.parse(localStorage.getItem("userInfo"));
        if (typeof info != "object" && info != null)
          throw new Error("Данные повреждены");
        if (info != null) userInfo = info;
        else {
          userInfo = {
            knownWords: [],
            wordsToStudy: [],
            wordsToRepeat: [],
            relevance: [],
            options: [
              {
                countKnownWordsAtOneTime: 50,
                countWrongsToAddToRepeat: 3,
                regularityToRepeat: [2, 2, 2, 4, 4, 4, 8, 8],
                maxDateCheckRelevance: 45,
                maxCountCheckRelevance: 3,
              },
            ],
            categoriesToLearn: [],
          };
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        return userInfo;
      } catch (err) {
        console.log(err);
        (async () => {
          await nextTick();
          this.showInfo(
            "Пользовательские данные",
            "Ваши локальные пользовательские данные были испорчены, всвязи с этим они были очищены!"
          );
        })();
        localStorage.clear();
        let userInfo = {
          knownWords: [],
          wordsToStudy: [],
          wordsToRepeat: [],
          relevance: [],
          options: [
            {
              countKnownWordsAtOneTime: 50,
              countWrongsToAddToRepeat: 3,
              regularityToRepeat: [2, 2, 2, 4, 4, 4, 8, 8],
              maxDateCheckRelevance: 45,
              maxCountCheckRelevance: 3,
            },
          ],
          categoriesToLearn: [],
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        return userInfo;
      }
    },
    caseOfCount(wrongs) {
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

        let res = this.$store.getters.getAuth
          ? await this.$api.words.startLearnCategory(form)
          : this.$api.offWords.startLearnCategory(form);

        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        let message = res?.data?.message || res?.message;
        await this.showInfo("Изменения статуса категории", message);
        this.currentSelectedCategory = {};
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        let status = err?.response?.status;
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
        let res = this.$store.getters.getAuth
          ? await this.$api.words.deleteCategory(id)
          : this.$api.offWords.deleteCategory(id);

        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        let message = res?.data?.message || res?.message;
        await this.showInfo("Удаление категории", message);
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        let status = err?.response?.status;
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
        let res = this.$store.getters.getAuth
          ? await this.$api.words.deleteWord(id)
          : this.$api.offWords.deleteWord(id);

        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        let message = res?.data?.message || res?.message;
        await this.showInfo("Удаление слова", message);
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        let status = err?.response?.status;
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
        (item) => item.category == categoryID
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
