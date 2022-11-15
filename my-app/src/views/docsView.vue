<template>
  <div class="docs">
    <div class="docs__link">
      <h2>Руководство</h2>
      <div v-for="(itemDocs, indexDocs) in docs" :key="indexDocs">
        <h1
          class="docs__header"
          :class="currentHeader == indexDocs ? '_active' : ''"
          @click="selectHeader"
        >
          {{ indexDocs }}
        </h1>
        <div v-if="currentHeader == indexDocs">
          <a
            v-for="(item, index) in itemDocs"
            :key="index"
            :href="`#${item}`"
            class="docs__chapter"
            :class="currentChapter == item ? '_active' : ''"
            >{{ index }}</a
          >
        </div>
      </div>
    </div>
    <div class="docs__content">
      <div v-if="currentHeader == 'Введение'">Введение</div>
      <div v-if="currentHeader == 'Отведение'">Отведение</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentHeader: "Введение",
      currentChapter: "whatIsDictionary",
      docs: {
        Введение: {
          "Что такое dictionary project?": "whatIsDictionary",
          "Начало работы": "startWork",
        },
        Отведение: {
          "Что такое dictionary project?": "whatIsDictionary",
          "Начало работы": "startWork",
        },
      },
    };
  },
  methods: {
    selectHeader(event) {
      this.currentHeader = event.target.textContent;
    },
  },
};
</script>

<style></style>
