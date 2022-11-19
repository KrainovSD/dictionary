<template>
  <div class="modal__backDrop" ref="backDrop">
    <div class="learnCard">
      <img
        src="@/assets/close.png"
        alt=""
        class="sign__closeButton"
        @click.stop="closePopup"
      />
      <div class="learnCard__container">
        <div class="learnCard__progressContainer">
          <p class="learnCard__countWord">2/60</p>
          <div class="learnCard__progressBar">
            <div
              class="learnCard__progress"
              :style="`width: ${progress}%`"
            ></div>
          </div>
        </div>
        <p class="learnCard__word">Страхование</p>
        <p class="learnCard__description">
          An agreement in which you pay a company money and they pay your costs
          if you have an accident, injury, etc.:
        </p>
        <div class="learnCard__workContainer">
          <template v-if="showAnswer == true">
            <p class="learnCard__answer">Insurance</p>
            <p class="learnCard__transcriprion">[ɪnˈʃʊərəns]</p>
            <div class="learnCard__examples">
              <p class="learnCard__example">
                Example: Any life insurance agent will tell you that. Any life
                insurance agent will tell you that.
              </p>
              <p class="learnCard__example">
                Example: Any life insurance agent will tell you that. Any life
                insurance agent will tell you that.
              </p>
              <p class="learnCard__example">
                Example: Any life insurance agent will tell you that. Any life
                insurance agent will tell you that.
              </p>
            </div>
            <button class="learnCard__confirm" ref="confirm" @click="nextWord">
              Далее
            </button>
          </template>
          <template v-if="learnType == 'standart' && showAnswer == false">
            <input type="text" class="learnCard__input" placeholder="Answer" />
            <button
              class="learnCard__confirm"
              @click="confirmAnswer"
              ref="confirm"
            >
              Подтвердить
            </button>
          </template>
          <template v-if="learnType == 'reverse' && showAnswer == false">
            <div class="learnCard__optionContainer">
              <div style="display: flex; width: 100%">
                <div class="learnCard__optionItem left">Страхование</div>
                <div class="learnCard__optionItem right">
                  "ренгентоэлектрокардиограф
                </div>
              </div>
              <div style="display: flex; width: 100%">
                <div class="learnCard__optionItem left">Уберегание</div>
                <div class="learnCard__optionItem right">Прибирание</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    learnType: String,
  },
  data() {
    return {
      progress: 0,
      showAnswer: false,
      focusInput: false,
    };
  },
  mounted() {},

  methods: {
    closePopup() {
      if (!this.$refs.backDrop.classList.contains("close")) {
        this.$refs.backDrop.classList.toggle("close");
        setTimeout(() => {
          this.$refs.backDrop.classList.toggle("close");
          this.$emit("close");
        }, 300);
      }
    },
    async animatedConfirm(object) {
      object.classList.toggle("_active");
      setTimeout(() => {
        object.classList.toggle("_active");
      }, 300);
    },
    nextWord() {
      let confirm = this.$refs.confirm;
      if (!confirm.classList.contains("_active")) {
        this.animatedConfirm(confirm);
      }
    },
    confirmAnswer() {
      let confirm = this.$refs.confirm;
      if (!confirm.classList.contains("_active")) {
        this.animatedConfirm(confirm);
      }
    },
  },
};
</script>

<style></style>
