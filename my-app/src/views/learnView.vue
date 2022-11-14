<template>
  <div class="learnType">
    <div class="learnType__container">
      <router-link :to="{ name: 'known' }" class="learnType__button">
        Изученные
      </router-link>
      <router-link :to="{ name: 'newWords' }" class="learnType__button">
        Изучаемые
      </router-link>
      <router-link :to="{ name: 'repeat' }" class="learnType__button">
        Повторяемые
      </router-link>
    </div>
  </div>
  <div class="learnPlace">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style></style>
