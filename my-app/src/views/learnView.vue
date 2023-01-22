<template>
  <div class="learnType appearFly">
    <div class="learnType__container">
      <div class="learnType__linkContainer">
        <router-link
          :to="{
            name:
              this.$route.name.toLowerCase() == 'known' ? 'statistic' : 'known',
          }"
          class="learnType__button"
        >
          <img src="@/assets/known.png" alt="" class="learnType__linkIcon" />
          <p>Изученные</p>
        </router-link>
        <p>Всего слов: {{ countKnownWords }}</p>
      </div>
      <div class="learnType__linkContainer">
        <router-link
          :to="{
            name:
              this.$route.name.toLowerCase() == 'newwords'
                ? 'statistic'
                : 'newWords',
          }"
          class="learnType__button"
        >
          <img src="@/assets/study.png" alt="" class="learnType__linkIcon" />
          <p>Изучаемые</p>
        </router-link>
        <p>Всего слов: {{ countCategoriesWords }}</p>
      </div>
      <div class="learnType__linkContainer">
        <router-link
          :to="{
            name:
              this.$route.name.toLowerCase() == 'repeat'
                ? 'statistic'
                : 'repeat',
          }"
          class="learnType__button"
        >
          <img src="@/assets/repeat.png" alt="" class="learnType__linkIcon" />
          <p>Повторяемые</p>
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
      let userInfo = this.$store.getters.getUserInfo;
      if (Object.keys(userInfo)?.length == 0) {
        userInfo = this.$api.offline.getUserInfo();
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
};
</script>

<style></style>
