<template>
  <word-popup
    v-if="wordPopupVisible == true"
    @close="wordPopupVisible = false"
    @add="addWord"
    wordPopupType="add"
    :form="{ word: currentSelectWord }"
  />

  <div class="relevance appear">
    <div style="display: flex">
      <div style="position: relative; width: 45%; height: 100px">
        <input-tooltip
          type="textarea"
          maxLength="210"
          v-model="input"
          field="input"
          fontSize="16"
          :errors="errors"
          placeholder="Внесите слова"
        />
      </div>
      <div class="relevance__newInput">
        <p class="relevance__inputItem red">Glock - 1 (3)</p>
        <p class="relevance__inputItem green">Glock - 1 (3)</p>
        <p class="relevance__inputItem">Glock - 1 (3)</p>
      </div>
    </div>
    <div style="display: flex">
      <div style="display: flex; flex-direction: column; width: 45%">
        <button class="relevance__confirmInput" @click="addInput">
          Внести
        </button>
        <p class="relevance__info">
          Для записи слов и дальнейшей проверке на актуальность, внесите слово
          или слова, используя в качестве разделителя знак запятой или точки с
          запятой, в текстовое поле. <br />
          С правой стороны экрана слова выводятся с количеством встреч в течении
          месяца (первая цифра) и с общим количеством встреч с этим словом с
          момента записи слова (цифра в скобках). <br />
          Слова имеют три цвета при добавлении: зеленый - новое слово, черный -
          количество встреч не превысило минимум, красное - часто встречающееся
          вам слово.<br />
          Чтобы добавить слово, которое часто вам встречается, в любую категорию
          для дальнейшего изучения, выберите подходящее слово в окошке справа.
        </p>
        <button
          class="relevance__confirmAddWord"
          @click="wordPopupVisible = true"
        >
          Добавить слово!
        </button>
      </div>
      <div
        style="
          display: flex;
          flex-direction: column;
          width: 50%;
          margin: 15px 0 0 auto;
        "
      >
        <div style="height: 52px; display: flex">
          <div class="relevance__filterContainer">
            <slide-filter
              :filterList="filterList"
              @change="(payload) => (filter = payload)"
            />
          </div>
          <div class="relevance__searchContainer">
            <search-panel v-model="search" />
          </div>
        </div>

        <div class="relevance__list">
          <p
            class="relevance__word"
            id="Flex"
            @click="selectWord"
            :class="currentSelectWord == 'Flex' ? '_select' : ''"
          >
            Flex - 1 (2)
          </p>
          <p class="relevance__word red">Flex - 1 (2)</p>
          <p class="relevance__word">Flex - 1 (2)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wordPopup from "../components/wordPopup.vue";
import slideFilter from "../components/slideFilter.vue";
import searchPanel from "../components/searchPanel.vue";
import inputTooltip from "../components/inputTooltip.vue";
export default {
  components: {
    wordPopup,
    slideFilter,
    searchPanel,
    inputTooltip,
  },
  data() {
    return {
      input: "",
      errors: {},
      search: "",
      filter: "letterUp",
      filterList: {
        letterUp: "По алфавиту от A до Z",
        letterDown: "По алфавиту от Z до A",
        countPerMonthUp: "По количеству встреч за месяц (по возрастанию)",
        countPerMonthDown: "По количеству встреч за месяц (по убыванию)",
        countPerBirthUp: "По общему количеству встреч (по возрастанию)",
        countPerBirthDown: "По общему количеству встреч (по убыванию)",
      },
      currentSelectWord: "",
      wordPopupVisible: false,
      categoryPopupVisible: false,
    };
  },

  methods: {
    selectWord(event) {
      let word = event.target.id;
      this.currentSelectWord = word;
    },
    validateInput(field, input) {
      if (input == "") {
        this.errors[field] = "Заполните поле!";
        return;
      }
      if (typeof input != "string") {
        this.errors[field] = "Неверный тип данных!";
        return;
      }
      if (!/^[a-zA-Z ,\-;]+$/.test(input)) {
        this.errors[field] =
          "Для записи слов используйте английский алфавит с разделителем в виде запятой или точки с запятой!";
        return;
      }
      if (input.length > 210) {
        this.errors[field] = "Длина списка не должна превышать 200 символов!";
        return;
      }
      delete this.errors[field];
    },
    addInput() {
      this.validateInput("input", this.input);
      if (this.errors?.input == "") {
        let words = this.input.split(/[,;]/);
        console.log(this.input, words);
        words = words.filter((el) => el.trim() != "");
        words = words.map((el) => {
          return el.trim();
        });
        console.log(words);
      }
    },
    addWord() {},
  },
  watch: {
    input() {
      if (this.errors?.input) this.validateInput("input", this.input);
    },
  },
};
</script>

<style></style>
