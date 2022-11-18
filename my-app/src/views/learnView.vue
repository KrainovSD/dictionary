<template>
  <div class="learnType">
    <div class="learnType__container">
      <div class="learnType__linkContainer">
        <router-link :to="{ name: 'known' }" class="learnType__button">
          Изученные
        </router-link>
        <p>Всего слов: {{}}1904</p>
      </div>
      <div class="learnType__linkContainer">
        <router-link :to="{ name: 'newWords' }" class="learnType__button">
          Изучаемые
        </router-link>
        <p>Всего слов: {{}}4242</p>
      </div>
      <div class="learnType__linkContainer">
        <router-link :to="{ name: 'repeat' }" class="learnType__button">
          Повторяемые
        </router-link>
        <p>Всего слов: {{}}</p>
      </div>
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
