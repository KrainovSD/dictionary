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
export default {
  data() {
    return {};
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
    countKnownWords() {
      if (this.userInfo?.knownWords) return this.userInfo?.knownWords.length;
      return "Не обнаружено";
    },
    countCategoriesWords() {
      if (this.userInfo?.wordsToStudy)
        return this.userInfo?.wordsToStudy.length;
      return "Не обнаружено";
    },
    countRepeatWords() {
      if (this.userInfo?.wordsToRepeat)
        return this.userInfo?.wordsToRepeat.length;
      return "Не обнаружено";
    },
  },
};
</script>

<style></style>
