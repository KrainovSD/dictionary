<template>
  <div
    class="translateTooltip"
    v-if="
      !error &&
      ((adviceWord.length > 0 && this.word != this.adviceWord) ||
        (adviceTranscription.length > 0 &&
          this.transcription != this.adviceTranscription) ||
        (adviceTranslate.length > 0 && adviceTranslateUsed != true))
    "
  >
    <div
      class="translateTooltip__adviceWordContainer"
      v-if="adviceWord.length > 0 && this.word != this.adviceWord"
    >
      <p>Возможно вы имели ввиду:</p>

      <div
        @click="
          $emit('changeWord', adviceWord);
          this.translateApi();
        "
        class="translateTooltip__adviceWord"
      >
        {{ adviceWord }}
      </div>
    </div>
    <div
      class="translateTooltip__adviceTranscriptionContainer"
      v-if="
        adviceTranscription.length > 0 &&
        this.transcription != this.adviceTranscription
      "
    >
      <p>Транскрипция:</p>

      <div
        class="translateTooltip__adviceTranscription"
        @click="$emit('changeTranscription', adviceTranscription)"
      >
        {{ adviceTranscription }}
      </div>
    </div>
    <div
      class="translateTooltip__adviceTranslateContainer"
      v-if="adviceTranslate.length > 0 && adviceTranslateUsed != true"
    >
      <p>Варианты перевода:</p>

      <template v-for="(item, index) in adviceTranslate" :key="index">
        <div
          class="translateTooltip__adviceTranslate"
          v-if="!translateList.includes(item)"
          @click="$emit('changeTranslate', item)"
        >
          {{ item }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  emits: [
    "changeWord",
    "changeTranscription",
    "changeTranslate",
    "changeAdviceWord",
    "changeAdviceTranslate",
    "changeAdviceTranscription",
  ],
  props: {
    word: String,
    translate: String,
    transcription: String,
    error: String,
  },
  data() {
    return {
      adviceWord: "",
      adviceTranslate: [],
      adviceTranscription: "",
    };
  },
  timerAPIController: null,
  delayAPI: 2000,
  mounted() {
    if (this.word.length > 0) this.translateApi();
  },
  computed: {
    translateList() {
      let translateList = this.translate.split(",");
      translateList = translateList.filter((item) => item.trim() != "");
      translateList = translateList.map((item) => item.trim());
      return translateList;
    },
    adviceTranslateUsed() {
      if (this.adviceTranslate.length == 0) return true;
      let flag = true;
      for (let item of this.adviceTranslate) {
        if (this.translateList.includes(item)) continue;
        flag = false;
      }
      return flag;
    },
  },
  methods: {
    async translateApi() {
      clearTimeout(this.$options.timerAPIController);
      this.$options.timerAPIController = setTimeout(async () => {
        try {
          let res = await this.$api.words.translateAPI(
            this.word.toLowerCase().trim()
          );
          let { adviceWord, adviceTranslate, adviceTranscription } = res;
          this.adviceWord = adviceWord.length > 0 ? adviceWord : "";
          this.adviceTranscription =
            adviceTranscription.length > 0 ? adviceTranscription : "";
          this.adviceTranslate =
            adviceTranslate.length > 0 ? adviceTranslate : [];
        } catch (err) {
          this.adviceWord = "";
          this.adviceTranscription = "";
          this.adviceTranslate = [];
        }
      }, this.$options.delayAPI);
    },
  },
  watch: {
    word() {
      this.translateApi();
    },
    adviceWord() {
      this.$emit("changeAdviceWord", this.adviceWord);
    },
    adviceTranslate() {
      this.$emit("changeAdviceTranslate", this.adviceTranslate);
    },
    adviceTranscription() {
      this.$emit("changeAdviceTranscription", this.adviceTranscription);
    },
  },
};
</script>

<style>
.translateTooltip {
  position: absolute;
  left: -112%;
  top: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: rem(16);
  width: 350px;
  border-radius: 5px;
  padding: 9px 9px;
  margin-left: 8px;
  transform: translateX(0%) translateY(-50%);
}
@media (max-width: 1199px) {
  .translateTooltip {
    display: none;
  }
}

.translateTooltip::before {
  content: "";
  position: absolute;
  border-width: 4px 6px 0 6px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.7) transparent transparent transparent;
  left: 98.9%;
  top: 50%;
  transform: translatey(-50%) rotate(-90deg);
}
.translateTooltip__adviceWordContainer {
  margin-top: 7px;
  margin-bottom: 7px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.translateTooltip__adviceWordContainer p {
  display: inline-block;
  line-height: 1.5;
  vertical-align: middle;
  margin-left: 5px;
}

.translateTooltip__adviceWord {
  background-color: red;
  padding: 0 5px;
  margin-bottom: 5px;
  margin-left: 5px;
  line-height: 1.5;
  cursor: pointer;
}
.translateTooltip__adviceTranscriptionContainer {
  margin-top: 7px;
  margin-bottom: 7px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.translateTooltip__adviceTranscriptionContainer p {
  display: inline-block;
  line-height: 1.5;
  vertical-align: middle;
  margin-left: 5px;
}

.translateTooltip__adviceTranscription {
  background-color: orange;
  padding: 0 5px;
  margin-bottom: 5px;
  margin-left: 5px;
  line-height: 1.5;
  cursor: pointer;
}
.translateTooltip__adviceTranslateContainer {
  margin-top: 7px;
  margin-bottom: 7px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.translateTooltip__adviceTranslateContainer p {
  display: inline-block;
  line-height: 1.5;
  vertical-align: middle;
  margin-left: 5px;
}
.translateTooltip__adviceTranslate {
  background-color: green;
  padding: 0 5px;
  margin-bottom: 5px;
  margin-left: 5px;
  line-height: 1.5;
  cursor: pointer;
}
</style>
