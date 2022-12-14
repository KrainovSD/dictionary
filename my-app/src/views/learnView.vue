<template>
  <div class="learnType appear">
    <div class="learnType__container">
      <div class="learnType__linkContainer">
        <router-link :to="{ name: 'known' }" class="learnType__button">
          Изученные
        </router-link>
        <p>Всего слов: {{ countKnownWords }}</p>
      </div>
      <div class="learnType__linkContainer">
        <router-link :to="{ name: 'newWords' }" class="learnType__button">
          Изучаемые
        </router-link>
        <p>Всего слов: {{ countCategoriesWords }}</p>
      </div>
      <div class="learnType__linkContainer">
        <router-link :to="{ name: 'repeat' }" class="learnType__button">
          Повторяемые
        </router-link>
        <p>Всего слов: {{ countRepeatWords }}</p>
      </div>
    </div>
  </div>
  <div class="learnPlace">
    <router-view />
  </div>
</template>

<script>
import { nextTick } from "@vue/runtime-core";
export default {
  data() {
    return {};
  },
  computed: {
    userInfo() {
      let userInfo = this.$store.getters.getUserInfo;
      if (Object.keys(userInfo)?.length == 0) {
        userInfo = this.getUserInfoFromLocalStorage();
      }
      return userInfo;
    },
    countKnownWords() {
      if (this.userInfo?.knownWords) {
        let words = this.userInfo.knownWords.filter(
          (item) => item?.offline != "delete"
        );
        return words.length;
      }
      return "Не обнаружено";
    },
    countCategoriesWords() {
      if (this.userInfo?.wordsToStudy) {
        let words = this.userInfo.wordsToStudy.filter(
          (item) => item?.offline != "delete"
        );
        return words.length;
      }
      return "Не обнаружено";
    },
    countRepeatWords() {
      if (this.userInfo?.wordsToRepeat) {
        let words = this.userInfo.wordsToRepeat.filter(
          (item) => item?.offline != "delete"
        );
        return words.length;
      }
      return "Не обнаружено";
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
  },
};
</script>

<style></style>
