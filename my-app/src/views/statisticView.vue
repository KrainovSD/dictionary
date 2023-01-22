<template>
  <div class="statistic appearVision">
    <div class="statistic__bestStreak">
      Лучшая непрерывная серия изучения: <b>{{ bestStreak }}</b>
    </div>
    <div class="statistic__bestStreak">
      Текущая непрерывная серия изучения: <b>{{ currentStreak }}</b>
    </div>
    <div class="statistic__chartContainer">
      <chart-view
        :firstElements="firstElements"
        :secondElements="secondElements"
        :dateRegistration="userInfo.dateRegistration"
      />
    </div>
  </div>
</template>

<script>
import chartView from "../components/chartView.vue";
export default {
  components: {
    chartView,
  },
  computed: {
    userInfo() {
      let userInfo = this.$store.getters.getUserInfo;
      if (Object.keys(userInfo)?.length == 0) {
        userInfo = this.$api.offline.getUserInfo();
      }
      return userInfo;
    },
    bestStreak() {
      let bestStreak = `${this.userInfo?.statistics?.[0]?.bestStreak}`;
      if (bestStreak == "undefined") return "Неизвестно";
      let label = "";
      let index = bestStreak?.length - 1;

      if (bestStreak[index] == 1) label = "день";
      else if (
        bestStreak[index] == 2 ||
        bestStreak[index] == 3 ||
        bestStreak[index] == 4
      )
        label = "дня";
      else label = "дней";
      return `${bestStreak} ${label}`;
    },
    currentStreak() {
      let currentStreak = `${this.userInfo?.statistics?.[0]?.currentStreak}`;
      if (currentStreak == "undefined") return "Неизвестно";
      let label = "";
      let index = currentStreak?.length - 1;
      if (currentStreak[index] == 1) label = "день";
      else if (
        currentStreak[index] == 2 ||
        currentStreak[index] == 3 ||
        currentStreak[index] == 4
      )
        label = "дня";
      else label = "дней";
      return `${currentStreak} ${label}`;
    },
    firstElements() {
      let knownWords = this.userInfo?.knownWords;
      knownWords = knownWords.filter((item) => item?.offline != "delete");
      knownWords = knownWords.map((item) => item.dateOfKnown);
      return knownWords;
    },
    secondElements() {
      let categories = this.userInfo?.categoriesToLearn.filter(
        (item) => item.startLearn == true && item?.offline != "delete"
      );
      let secondElements = [];
      for (let category of categories) {
        let id = category._id;
        let date = category.dateOfStartLearn;
        let words = this.userInfo?.wordsToStudy.filter(
          (item) => item.category == id
        );
        for (let i = 0; i < words.length; i++) {
          secondElements.push(date);
        }
      }
      return secondElements;
    },
  },
};
</script>

<style></style>
