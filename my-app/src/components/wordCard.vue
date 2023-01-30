<template>
  <div class="word__list" @click.self="currentSelectedWord = ''">
    <div class="word__wordPlaceholder" v-if="wordsList?.length == 0">WORDS</div>
    <div class="word__container" v-else @click.self="currentSelectedWord = ''">
      <div
        class="word"
        v-for="(item, index) in wordsList"
        :class="[
          currentSelectedWord == item._id ? 'selected' : '',
          wordColor(item),
          multiSelecteditems.includes(item._id) ? '_multiSelect' : '',
        ]"
        :key="index"
        :id="item._id"
        @click="selectWord"
        ref="word"
        @mousedown="multiSelectWord"
        @touchstart="multiSelectWord"
        @mouseup="dropMultiSelect"
        @touchend="dropMultiSelect"
      >
        <img src="@/assets/check.png" alt="" class="word__check" />
        <img
          src="@/assets/pointMenu.png"
          alt=""
          class="word__openCRUD"
          @click.stop="toggleCRUD"
          v-if="!item.infoNextRepeat"
        />
        <div
          class="word__CRUD"
          :class="item._id == currentCrudID ? '_active' : ''"
        >
          <p
            @click="
              this.currentSelectedWord = item._id;
              $emit('update', item._id);
            "
            v-if="!item.infoLastRepeat"
          >
            Редактировать
          </p>
          <p
            @click="
              this.currentSelectedWord = item._id;

              $emit('delete', item._id);
            "
            v-if="item.infoMultiSelect"
          >
            Удалить
          </p>
        </div>

        <div class="word__info">
          <p class="word__word">{{ item.word }}</p>
          <p class="word__translate">{{ item.translate }}</p>
          <p class="word__transcription">{{ item.transcription }}</p>
        </div>
        <div
          class="word__detailContainer"
          v-if="currentSelectedWord == item._id"
        >
          <p class="word__description" v-if="item.description != ''">
            <b>Description:</b> {{ item.description }}
          </p>
          <div class="word__examples" v-if="item.infoExample?.length > 0">
            <p><b>Examples:</b></p>
            <p
              v-for="(itemExample, indexExample) in item.infoExample"
              :key="indexExample"
            >
              {{ indexExample + 1 }}. {{ itemExample }}
            </p>
          </div>
          <div class="word__subInfo">
            <p><b>Info:</b></p>
            <p v-if="item.infoLastRepeat || item.infoLastRepeat === 0">
              Последнее повторение в обычном режиме: {{ item.infoLastRepeat }}
            </p>
            <p
              v-if="
                item.infoLastReverseRepeat || item.infoLastReverseRepeat === 0
              "
            >
              Последнее повторение в обратном режиме:
              {{ item.infoLastReverseRepeat }}
            </p>
            <p v-if="item.infoCountRepeat || item.infoCountOfRepeat === 0">
              Количество обычных повторений:
              {{ item.infoCountRepeat }}
            </p>
            <p
              v-if="
                item.infoCountReverseRepeat ||
                item.infoCountOfReverseRepeat === 0
              "
            >
              Количество реверсивных повторений:
              {{ item.infoCountReverseRepeat }}
            </p>

            <p v-if="item.infoNextRepeat || item.infoNextRepeat === 0">
              Следующее обычное повторение: {{ item.infoNextRepeat }}
            </p>
            <p
              v-if="
                item.infoNextReverseRepeat || item.infoNextReverseRepeat === 0
              "
            >
              Следующее реверсивное повторение: {{ item.infoNextReverseRepeat }}
            </p>
            <p v-if="item.infoCountOfRepeat || item.infoCountOfRepeat === 0">
              Осталось обычных повторений: {{ item.infoCountOfRepeat }}
            </p>
            <p
              v-if="
                item.infoCountOfReverseRepeat ||
                item.infoCountOfReverseRepeat === 0
              "
            >
              Осталось реверсивных повторений:
              {{ item.infoCountOfReverseRepeat }}
            </p>
            <p v-if="typeof item.wrongs == 'number'">
              Количество ошибок, допущенных в слове: {{ item.wrongs }}
              {{ captionOfCountWrongs(item.wrongs) }}
            </p>
            <p v-if="item.infoCategory" class="word__categoryName">
              <b>Category:</b> {{ item.infoCategory }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: [
    "changeCurrentSelectedWord",
    "update",
    "delete",
    "changeMultiSelected",
  ],
  props: {
    wordsList: Object,
    currentMultiSelectedWords: Array,
  },
  data() {
    return {
      currentSelectedWord: "",
      currentCrudID: "",
      multiMod: false,
      multiSelecteditems: [],
      preventClick: false,
    };
  },
  selectController: null,
  oldScrollPosition: null,
  mounted() {
    window.addEventListener("touchmove", this.moveDropMultiSelect);
  },
  beforeUnmount() {
    window.removeEventListener("touchmove", this.moveDropMultiSelect);
  },
  methods: {
    captionOfCountWrongs(wrongs) {
      if (wrongs == 2 || wrongs == 3 || wrongs == 4) return "раза";
      return "раз";
    },
    wordColor(item) {
      if (
        (!item.dateOfCreation && item.dateOfCreation !== 0) ||
        (!item.nextRepeat && item.nextRepeat !== 0) ||
        (!item.nextReverseRepeat && item.nextReverseRepeat !== 0)
      )
        return "";
      let now = this.$api.offline.getDayFromMillisecond(Date.now());
      let dateOfCreation = this.$api.offline.getDayFromMillisecond(
        item.dateOfCreation
      );
      let nextRepeat = this.$api.offline.getDayFromMillisecond(item.nextRepeat);
      let nextReverseRepeat = this.$api.offline.getDayFromMillisecond(
        item.nextReverseRepeat
      );

      if (nextRepeat < now || nextReverseRepeat < now) {
        if (now - dateOfCreation <= 1) return "yellow";
        return "red";
      }
      if (nextRepeat == now || nextReverseRepeat == now) return "yellow";

      return "";
    },
    toggleCRUD(e) {
      if (this.multiMod) return this.selectWord(e);
      let target = e.target;
      while (!target.classList.contains("word")) {
        target = target.parentNode;
      }
      const id = target.id;
      if (this.currentCrudID == "") {
        this.currentCrudID = id;
        this.currentSelectedWord = id;
      } else if (id == this.currentCrudID) this.currentCrudID = "";
      else {
        this.currentCrudID = id;
        this.currentSelectedWord = id;
      }
    },
    selectWord(e) {
      if (this.preventClick) {
        this.preventClick = false;
        return;
      }

      let target = e.target;
      while (!target.classList.contains("word")) {
        target = target.parentNode;
      }
      const id = target.id;
      if (!this.multiMod) {
        this.currentSelectedWord = this.currentSelectedWord == id ? "" : id;
        this.currentCrudID = "";
      } else {
        if (target.classList.contains("_multiSelect")) {
          this.multiSelecteditems = this.multiSelecteditems.filter((item) => {
            return item != id;
          });
          if (this.multiSelecteditems.length == 0) this.multiMod = false;
        } else {
          this.multiSelecteditems.push(id);
        }
      }
    },
    multiSelectWord(e) {
      let target = e.target;
      while (!target.classList.contains("word")) {
        target = target.parentNode;
      }
      const id = target.id;
      const index = this.wordsList.findIndex((item) => item._id == id);
      if (index == -1) return;
      if (!this.wordsList[index].infoMultiSelect) return;

      this.$options.selectController = setTimeout(() => {
        if (e.type == "mousedown" && this.currentSelectedWord != id)
          this.preventClick = true;
        this.currentSelectedWord = "";
        this.multiSelecteditems.push(id);
        this.multiMod = true;
      }, 800);
    },
    dropMultiSelect() {
      clearTimeout(this.$options.selectController);
    },
    moveDropMultiSelect(e) {
      let oldScrollPosition = this.$options.oldScrollPosition;
      let currentPosition = e.changedTouches[0].clientY;
      if (oldScrollPosition != currentPosition) {
        clearTimeout(this.$options.selectController);
      }

      this.$options.oldScrollPosition = currentPosition;
    },
  },
  watch: {
    wordsList() {
      this.currentSelectedWord = "";
    },
    currentSelectedWord() {
      this.$emit("changeCurrentSelectedWord", this.currentSelectedWord);
      if (this.currentSelectedWord == "") this.currentCrudID = "";
    },
    multiSelecteditems: {
      handler() {
        if (this.currentMultiSelectedWords != this.multiSelecteditems)
          this.$emit("changeMultiSelected", this.multiSelecteditems);
      },
      deep: true,
    },
    currentMultiSelectedWords: {
      handler() {
        if (this.currentMultiSelectedWords != this.multiSelecteditems) {
          this.multiSelecteditems = this.currentMultiSelectedWords;
          this.multiMod = false;
        }
      },
      deep: true,
    },
  },
};
</script>

<style></style>
