<template>
  <div class="docs appear">
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
            :href="`#${item[0]}`"
            class="docs__chapter"
            :class="currentChapter == item[0] ? '_active' : ''"
            >{{ index }}</a
          >
        </div>
      </div>
    </div>
    <div class="docs__content" ref="docsContent">
      <template v-for="(itemDocs, indexDocs) in docs" :key="indexDocs">
        <div v-if="currentHeader == indexDocs">
          <h2 class="docs__contentHeader">{{ indexDocs }}</h2>
          <div
            v-for="(itemChapter, indexChapter) in itemDocs"
            :key="indexChapter"
          >
            <h1
              class="docs__contentChapter"
              :id="itemChapter[0]"
              :ref="collectChapters"
            >
              {{ indexChapter }}
            </h1>
            <p
              class="docs__contentText"
              v-for="(itemContent, indexContent) in itemChapter[1]"
              :key="indexContent"
            >
              {{ itemContent }}
            </p>
          </div>
        </div>
      </template>
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
          "Что такое dictionary project?": [
            "whatIsDictionary",
            [
              "Vue (произносится /vjuː/, примерно как view) — это прогрессивный фреймворк для создания пользовательских интерфейсов. В отличие от фреймворков-монолитов, Vue создан пригодным для постепенного внедрения. Его ядро в первую очередь решает задачи уровня представления (view), что упрощает интеграцию с другими библиотеками и существующими проектами. С другой стороны, Vue полностью подходит и для создания сложных одностраничных приложений (SPA, Single-Page Applications), если использовать его совместно с современными инструментами и дополнительными библиотеками.",
              "Если вы хотите узнать больше о Vue перед тем как начать, мы создали видео с рассказом об основных принципах работы на примере проекта.",
            ],
          ],
          "Начало работы": [
            "startWork",
            [
              "Vue (произносится /vjuː/, примерно как view) — это прогрессивный фреймворк для создания пользовательских интерфейсов. В отличие от фреймворков-монолитов, Vue создан пригодным для постепенного внедрения. Его ядро в первую очередь решает задачи уровня представления (view), что упрощает интеграцию с другими библиотеками и существующими проектами. С другой стороны, Vue полностью подходит и для создания сложных одностраничных приложений (SPA, Single-Page Applications), если использовать его совместно с современными инструментами и дополнительными библиотеками.",
              "Если вы хотите узнать больше о Vue перед тем как начать, мы создали видео с рассказом об основных принципах работы на примере проекта.",
            ],
          ],
          Возможности: [
            "opportunity",
            [
              "Vue (произносится /vjuː/, примерно как view) — это прогрессивный фреймворк для создания пользовательских интерфейсов. В отличие от фреймворков-монолитов, Vue создан пригодным для постепенного внедрения. Его ядро в первую очередь решает задачи уровня представления (view), что упрощает интеграцию с другими библиотеками и существующими проектами. С другой стороны, Vue полностью подходит и для создания сложных одностраничных приложений (SPA, Single-Page Applications), если использовать его совместно с современными инструментами и дополнительными библиотеками.",
              "Если вы хотите узнать больше о Vue перед тем как начать, мы создали видео с рассказом об основных принципах работы на примере проекта.",
            ],
          ],
        },
        Отведение: {
          "Что такое dictionary project?": [
            "whatIsDictionary",
            [
              "Vue (произносится /vjuː/, примерно как view) — это прогрессивный фреймворк для создания пользовательских интерфейсов. В отличие от фреймворков-монолитов, Vue создан пригодным для постепенного внедрения. Его ядро в первую очередь решает задачи уровня представления (view), что упрощает интеграцию с другими библиотеками и существующими проектами. С другой стороны, Vue полностью подходит и для создания сложных одностраничных приложений (SPA, Single-Page Applications), если использовать его совместно с современными инструментами и дополнительными библиотеками.",
              "Если вы хотите узнать больше о Vue перед тем как начать, мы создали видео с рассказом об основных принципах работы на примере проекта.",
            ],
          ],
          "Начало работы": [
            "startWork",
            [
              "Vue (произносится /vjuː/, примерно как view) — это прогрессивный фреймворк для создания пользовательских интерфейсов. В отличие от фреймворков-монолитов, Vue создан пригодным для постепенного внедрения. Его ядро в первую очередь решает задачи уровня представления (view), что упрощает интеграцию с другими библиотеками и существующими проектами. С другой стороны, Vue полностью подходит и для создания сложных одностраничных приложений (SPA, Single-Page Applications), если использовать его совместно с современными инструментами и дополнительными библиотеками.",
              "Если вы хотите узнать больше о Vue перед тем как начать, мы создали видео с рассказом об основных принципах работы на примере проекта.",
            ],
          ],
        },
      },
      chapters: [],
    };
  },
  mounted() {
    this.$refs.docsContent.addEventListener("scroll", this.selectChapter);
    /* Отправлять запрос серверу на скачивание документа и записывать его в docs */
  },

  methods: {
    selectHeader(event) {
      this.currentHeader = event.target.textContent;
      this.chapters = [];
      this.$refs.docsContent.scrollTo({ top: 0, behavior: "smooth" });
    },
    collectChapters(object) {
      if (object !== null) this.chapters.push(object);
    },
    getCoords(elem) {
      let box = elem.getBoundingClientRect();
      return {
        top: box.top + scrollY,
        left: box.left + scrollX,
      };
    },
    selectChapter() {
      this.chapters.forEach((chapter) => {
        const chapterTop = this.getCoords(chapter).top;
        if (chapterTop > -10 && chapterTop < 140) {
          if (this.currentChapter != chapter.id)
            this.currentChapter = chapter.id;
        }
      });
    },
  },
};
</script>

<style></style>
