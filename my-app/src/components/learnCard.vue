<template v-if="visible == true">
  <loading-popup v-if="isLoading == true" />
  <div class="modal__backDrop" ref="backDrop"></div>
  <div
    class="modal__container"
    :class="isMobile && kindOfLearn == 'standart' ? 'lcard' : 'info'"
  >
    <info-popup ref="info" />
    <confirm-popup ref="confirm" />
    <interactive-input-keyboard
      fontSize="18"
      :errors="errors.answer"
      :answer="answer"
      :interactive="interactiveInput"
      placeholder="Answer"
      @answer="(payload) => (this.answer = payload)"
      @enterDown="
        this.isVisibleAnswer == false
          ? this.throttleNormalConfirm()
          : this.nextWord()
      "
      v-if="isMobile && kindOfLearn == 'standart'"
    />
    <div
      class="learnCard"
      :class="isMobile && kindOfLearn == 'standart' ? '_mobile' : ''"
    >
      <close-modal-button
        @close="closePopup('event')"
        class="sign__closeButton"
      />
      <div
        class="learnCard__container"
        :class="isMobile && kindOfLearn == 'standart' ? '_mobile' : ''"
      >
        <div class="learnCard__progressContainer">
          <p class="learnCard__countWord">{{ progress }}/{{ countWords }}</p>
          <div class="learnCard__progressBar">
            <div
              class="learnCard__progress"
              :style="`width: ${progressBar}%`"
            ></div>
          </div>
        </div>
        <template v-if="kindOfLearn == 'standart'">
          <p class="learnCard__word">{{ word.translate }}</p>
          <p
            class="learnCard__description"
            v-if="word.description?.trim()?.length > 0"
          >
            Description: {{ word.description }}
          </p>
          <div class="learnCard__workContainer">
            <template v-if="isVisibleAnswer == true">
              <p class="learnCard__answer">{{ word.word }}</p>
              <p class="learnCard__transcriprion">{{ word.transcription }}</p>
              <div class="learnCard__examples">
                <template v-for="(item, index) in word.example" :key="index">
                  <p class="learnCard__example" v-if="item != ''">
                    Example: {{ item }}
                  </p>
                </template>
              </div>
              <div class="learnCard__confirmContainer">
                <confirm-button
                  :text="`Далее (${this.timerToShowAnswer} секунд)`"
                  @click="nextWord"
                  fontSize="14"
                />
              </div>
            </template>
            <template v-if="isVisibleAnswer == false">
              <p class="learnCard__try">
                Количество попыток: {{ countHasTry }}
              </p>
              <div class="learnCard__input">
                <interactive-input
                  fontSize="18"
                  :errors="errors.answer"
                  v-model="answer"
                  :interactive="interactiveInput"
                  placeholder="Answer"
                  @answer="(payload) => (this.answer = payload)"
                  @enterDown="throttleNormalConfirm"
                  v-if="!isMobile && kindOfLearn == 'standart'"
                />
              </div>
              <div class="learnCard__confirmContainer" v-if="!isMobile">
                <confirm-button
                  text="Подтвердить"
                  @click="throttleNormalConfirm"
                  fontSize="14"
                />
              </div>
            </template>
          </div>
        </template>

        <template v-if="kindOfLearn == 'reverse'">
          <p class="learnCard__word">{{ word.word }}</p>
          <p
            class="learnCard__description"
            v-if="word.description?.trim()?.length > 0"
          >
            Description: {{ word.description }}
          </p>
          <div class="learnCard__workContainer reverse">
            <div class="learnCard__optionContainer">
              <div
                class="learnCard__optionItem"
                v-for="(item, index) in reAnswerOptions"
                :key="index"
                :class="[
                  isVisibleAnswer == true && correctAnswer == item
                    ? '_correct'
                    : '',
                  isVisibleAnswer == true &&
                  correctAnswer != item &&
                  answer == item
                    ? '_wrong'
                    : '',
                ]"
                @click="reverseConfirm"
              >
                <p>{{ item }}</p>
              </div>
            </div>
            <div
              class="learnCard__confirmContainer"
              v-if="isVisibleAnswer == true"
            >
              <confirm-button
                :text="`Далее (${this.timerToShowAnswer} ${secondFormat})`"
                @click="nextWord"
                fontSize="14"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from "@vue/runtime-core";
import confirmButton from "../components/confirmButton.vue";
import infoPopup from "../components/infoPopup.vue";
import confirmPopup from "../components/confirmPopup.vue";
import interactiveInput from "../components/interactiveInput.vue";
import interactiveInputKeyboard from "../components/interactiveInputKeyboard.vue";
import closeModalButton from "../components/closeModalButton.vue";
import loadingPopup from "../components/loadingPopup.vue";

export default {
  emits: ["close"],
  components: {
    confirmButton,
    infoPopup,
    interactiveInput,
    interactiveInputKeyboard,
    confirmPopup,
    closeModalButton,
    loadingPopup,
  },
  data() {
    return {
      countWords: 0,
      progress: 1,
      learnType: "",
      word: {},
      reAnswerOptions: ["", "", "", ""],
      try: 0,
      answer: "",
      correctAnswer: "",
      isCorrectAnswer: false,
      interactiveInput: "",
      errors: {},
      visible: false,
      timerToShowAnswer: 0,
      isVisibleAnswer: false,
      isVisibleNext: false,
      isLoading: false,
      isMayEnterAnswer: true,
      isMobile: false,
    };
  },
  spareTranslates: [
    "большой",
    "потом",
    "надо",
    "слово",
    "идти",
    "большой",
    "место",
    "ничто",
    "иметь",
    "сейчас",
    "каждый",
    "лицо",
    "друг",
    "тоже",
    "видеть",
    "вопрос",
    "дом",
    "здесь",
    "там",
    "потому что",
    "смотреть",
    "ребенок",
    "сила",
    "казаться",
    "показывать",
    "стоять",
    "возможность",
    "результат",
    "форма",
    "связь",
    "минута",
    "находиться",
    "собственный",
    "написать",
    "мысль",
    "дорога",
    "действие",
    "месяц",
    "государство",
    "язык",
    "любовь",
    "играть",
    "запрещать",
    "уйти",
    "цель",
    "убийство",
    "общество",
    "среди",
    "деятельность",
    "театр",
    "церковь",
    "организация",
    "окружающая среда",
    "момент",
    "вернуться",
    "начинать",
    "пробовать",
    "появиться",
    "смысл",
    "слух",
    "орган",
    "легкие",
    "почка",
    "квартира",
    "знакомить",
    "внимание",
    "рынок",
    "известный",
    "завод",
    "совершенный",
    "простой",
    "гостепреимный",
    "автор",
    "производитель",
    "правило",
    "управление",
    "слышать",
    "идея",
    "совет",
    "собираться",
    "движение",
    "вещь",
    "причина",
    "газета",
    "против",
    "современный",
    "ценность",
    "речь",
    "возможность",
    "культура",
    "загрязнение",
    "рассказать",
    "около",
    "проект",
    "забыть",
    "документ",
    "украсть",
    "сильный",
    "палец руки",
    "палец ноги",
    "опыт",
    "служба",
    "внутренний",
    "просить",
    "очередь",
    "принимать",
    "заслуживать",
    "состав",
    "зал",
    "шаг",
    "необходимый",
    "внезапный",
    "структура",
    "начальник",
    "исследование",
    "верить",
    "позволять",
    "тип",
  ],
  timeToShowAnswer: 15000,
  countTryToAnswer: 3,
  delayToEnterAnswer: 1200,
  enterAnswerController: null,
  setTimeoutController: null,
  timerContoller: null,
  promiseController: null,
  beforeUnmount() {
    document.removeEventListener("keyup", this.keyBoardEvent);
    window.removeEventListener("storage", this.resetStudy);
    window.removeEventListener("touchstart", this.switchMobile);
    clearTimeout(this.$options.enterAnswerController);
    if (this.isVisibleAnswer == false) return;
    clearTimeout(this.$options.setTimeoutController);
    clearInterval(this.$options.timerContoller);
    this.$options.promiseController.resolve(this.isCorrectAnswer);
  },
  mounted() {
    document.addEventListener("keyup", this.keyBoardEvent);
    window.addEventListener("storage", this.resetStudy);

    const devices = new RegExp(
      "Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini",
      "i"
    );
    if (devices.test(window.navigator.userAgent)) this.isMobile = true;
    window.addEventListener("touchstart", this.switchMobile);
  },
  computed: {
    headerInfo() {
      if (this.learnType == "learn")
        return "Повторение изучаемых слов в категориях";
      if (this.learnType == "reLearn")
        return "Реверсивное повторение изучаемых слов в категориях";
      if (this.learnType == "known") return "Повторение изученных слов";
      if (this.learnType == "reKnown")
        return "Реверсивное повторение изученных слов";
      if (this.learnType == "repeat")
        return "Повторение слов в которых допускались ошибки";
      if (this.learnType == "reRepeat")
        return "Реверсивное повторение слов в которых допускались ошибки";
      return "";
    },
    apiFunction() {
      if (this.learnType == "learn") return "pushLearnAnswers";
      if (this.learnType == "reLearn") return "pushReLearnAnswers";
      if (this.learnType == "known") return "pushKnownAnswers";
      if (this.learnType == "reKnown") return "pushReKnownAnswers";
      if (this.learnType == "repeat") return "pushRepeatAnswers";
      if (this.learnType == "reRepeat") return "pushReRepeatAnswers";
      return "";
    },
    kindOfLearn() {
      if (
        this.learnType == "learn" ||
        this.learnType == "known" ||
        this.learnType == "repeat"
      )
        return "standart";
      return "reverse";
    },
    progressBar() {
      let progressBar = Math.floor((this.progress / this.countWords) * 100);
      return progressBar;
    },
    countHasTry() {
      return this.$options.countTryToAnswer - this.try;
    },
    secondFormat() {
      if (this.timerToShowAnswer == 1) return "секунда";
      if (this.timerToShowAnswer >= 2 && this.timerToShowAnswer <= 4)
        return "секунды";
      return "секунд";
    },
  },

  methods: {
    switchMobile() {
      this.isMobile = true;
    },
    resetStudy() {
      this.$options.promiseController.resolve({ resetStudy: true });
    },
    randomNumber(max) {
      let random = Math.random();
      let min = 1;
      max = max + 1 - min;
      let number = min + random * max;
      return Math.floor(number);
    },
    setReverseSetting(word) {
      this.correctAnswer = word.translate.split(",")[0].trim().toLowerCase();
      let options = [];
      let wordsToStudy;

      let userInfo = this.$store.getters.getUserInfo;
      if (Object.keys(userInfo)?.length == 0) {
        userInfo = this.$api.offline.getUserInfo();
      }
      if (userInfo?.wordsToStudy?.length > 20)
        wordsToStudy = [...userInfo.wordsToStudy.map((item) => item.translate)];
      else wordsToStudy = this.$options.spareTranslates;

      while (options.length < 3) {
        let index = this.randomNumber(wordsToStudy.length) - 1;
        let option = wordsToStudy[index].split(",")[0].trim().toLowerCase();
        if (option != this.correctAnswer && !options.includes(option))
          options.push(option);
      }
      let correctIndex = this.randomNumber(4) - 1;
      this.reAnswerOptions[correctIndex] = this.correctAnswer;
      let answerIndex = 0;
      for (let option of options) {
        if (answerIndex == correctIndex) answerIndex++;
        this.reAnswerOptions[answerIndex] = option;
        answerIndex++;
      }
    },
    keyBoardEvent(event) {
      if (
        this.$refs.confirm.isVisible == true ||
        this.$refs.info.isVisible == true
      )
        return;
      let code = event.keyCode;
      if (code != 13) return;

      if (this.isVisibleAnswer == true && code == 13) return this.nextWord();

      if (
        this.kindOfLearn == "standart" &&
        this.isVisibleAnswer == false &&
        code == 13
      )
        return this.throttleNormalConfirm();
    },
    async showInfo(header, title) {
      await nextTick();
      await this.$refs.info.show(header, title);
    },
    async showConfirm(header, title) {
      await nextTick();
      return await this.$refs.confirm.show(header, title);
    },
    async animatedInput(type) {
      this.interactiveInput = type;
      return await new Promise((resolve) =>
        setTimeout(() => {
          this.interactiveInput = "";
          resolve();
        }, 800)
      );
    },
    async setTimer() {
      this.timerToShowAnswer = this.$options.timeToShowAnswer / 1000;
      this.$options.timerContoller = setInterval(() => {
        this.timerToShowAnswer--;
        if (this.timerToShowAnswer == 0)
          clearInterval(this.$options.timerContoller);
      }, 1000);
    },
    async closePopup(event = "undefinded") {
      if (this.$refs.confirm.isVisible == true || this.$refs.info.isVisible)
        return;
      if (event !== "undefinded") {
        let res = await this.showConfirm(
          "Окончание обучения",
          "Вы уверены, что хотите прервать сессию обучения? После возвращения вы сможете продолжить с того же места, на котором остановились!"
        );

        if (!res) return;
      }

      if (!this.$refs.backDrop.classList.contains("close")) {
        this.$refs.backDrop.classList.toggle("close");
        setTimeout(() => {
          this.$refs.backDrop.classList.toggle("close");
          this.visible = false;
          this.$emit("close");
        }, 300);
      }
    },
    validateAnswer(answer) {
      if (typeof answer != "string") {
        this.errors.answer = "Неверный тип данных!";
        return;
      }
      if (answer == "") {
        this.errors.answer = "Ответ пуст!";
        return;
      }
      if (!/^[a-zA-Z -]+$/.test(answer)) {
        this.errors.answer =
          "Слово или словосочетание может состоять только из букв английского алфавита, пробела и дефиса!";
        return;
      }
      if (answer.length > 50) {
        this.errors.answer =
          "Длина слова или словосочетания не должна превышать более 50 символов!";
        return;
      }
      delete this.errors.answer;
    },
    async getOldSession(newAnswers, newWords) {
      try {
        let oldAnswers = JSON.parse(localStorage.getItem(this.learnType));
        let anotherCategories = false;

        let oldCategory = oldAnswers.categoryID;
        let newCategory = newAnswers.categoryID;
        if (oldCategory.length != newCategory.length) {
          anotherCategories = true;
        }
        let notSameCategory = newCategory.filter(
          (item) => !oldCategory.includes(item)
        );
        if (notSameCategory.length > 0) {
          anotherCategories = true;
        }

        let oldWords = oldAnswers.wordsToLearn.map((item) => item.word);
        if (oldWords.length != newWords.length && anotherCategories == false) {
          localStorage.removeItem(this.learnType);
          return { newWords, newAnswers };
        }
        let notSameWords = newWords.filter(
          (item) => !oldWords.includes(item.word)
        );
        if (notSameWords.length > 0 && anotherCategories == false) {
          localStorage.removeItem(this.learnType);
          return { newWords, newAnswers };
        }

        let message;
        if (anotherCategories)
          message =
            "Вы уже начинали прохождение другой категории. Хотите ли вы продолжить проходить предыдущую сессию?";
        else
          message =
            "У вас сохранена не завершенная до конца прошлая сессия. Хотите ли вы продолжить ее прохождение?";

        let res = await this.showConfirm("Продолжить обучение", message);
        if (!res) {
          localStorage.removeItem(this.learnType);
          return { newWords, newAnswers };
        }

        newAnswers = oldAnswers;
        this.progress = newAnswers.words?.length + 1;
        this.countWords = newAnswers.wordsToLearn.length;
        if (this.progress > this.countWords) this.progress = this.countWords;
        let alreadyStudiedWords = newAnswers.words.map((item) => item.word);
        newWords = oldAnswers.wordsToLearn.filter(
          (item) => !alreadyStudiedWords.includes(item._id)
        );
        return { newWords, newAnswers };
      } catch (error) {
        localStorage.removeItem(this.learnType);
        return { newWords, newAnswers };
      }
    },
    async start(
      learnType,
      words,
      categoryID = ["undefined"],
      isPlannedLearn = true
    ) {
      try {
        this.learnType = learnType;
        this.countWords = words.length;
        this.progress = 1;
        this.visible = true;
        let answers = { categoryID, words: [], wordsToLearn: words };

        if (localStorage.getItem(this.learnType) !== null) {
          let newSession = await this.getOldSession(answers, words);
          answers = newSession.newAnswers;
          words = newSession.newWords;
        }

        for (let word of words) {
          this.isVisibleAnswer = false;
          this.isVisibleNext = false;
          let answer = {};
          this.try = 0;
          this.word = word;
          this.answer = "";
          if (this.kindOfLearn == "standart") this.correctAnswer = word.word;

          if (this.kindOfLearn == "reverse") this.setReverseSetting(word);
          await nextTick();
          let res = await this.checkAnswer();
          if (res?.resetStudy) return this.closePopup();
          if (!res) answer.wrong = true;
          answer.word = word._id;
          answers.words.push(answer);
          if (this.progress != this.countWords) this.progress++;

          if (isPlannedLearn)
            localStorage.setItem(this.learnType, JSON.stringify(answers));
        }
        if (this.isLoading == true) return;
        this.isLoading = true;

        delete answers.wordsToLearn;
        let res = this.$store.getters.getAuth
          ? await this.$api.words[this.apiFunction](answers)
          : this.$api.offline[this.apiFunction](answers);

        this.isLoading = false;
        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          this.$api.offline.setSignatureAPI(userInfo);
        }
        localStorage.removeItem(this.learnType);
        let message = res?.data?.message || res?.message;
        await this.showInfo("Обучение", message);
        return this.closePopup();
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        let status = err?.response?.status;
        this.isLoading = false;
        if (status == 0 || status == 500) {
          message =
            "Сервер не отвечает или интернет соединение утеряно, переводим операции в режим оффлайн! Повторно откройте обучение, чтобы сохранить прогресс в режиме оффлайн!";
          this.$store.commit("resetAuth");
          return this.closePopup();
        }
        localStorage.removeItem(this.learnType);
        await this.showInfo("Обучение", message);
        return this.closePopup();
      }
    },
    checkAnswer() {
      let resolve;
      const cardsPromise = new Promise((ok) => {
        resolve = ok;
      });
      this.$options.promiseController = { resolve };
      return cardsPromise;
    },
    showAnswer(correct) {
      this.isCorrectAnswer = correct;
      this.isVisibleAnswer = true;
      this.setTimer();
      this.isVisibleNext = true;
      this.$options.setTimeoutController = setTimeout(() => {
        this.$options.promiseController.resolve(correct);
      }, this.$options.timeToShowAnswer);
    },
    throttleNormalConfirm() {
      if (this.isMayEnterAnswer == false) return;
      this.normalConfirm();
      this.isMayEnterAnswer = false;
      this.$options.enterAnswerController = setTimeout(() => {
        this.isMayEnterAnswer = true;
      }, this.$options.delayToEnterAnswer);
    },
    async normalConfirm() {
      if (this.isVisibleAnswer == true) return;
      this.answer = this.answer.trim().toLowerCase();
      this.validateAnswer(this.answer);
      if (this.errors?.answer) return;

      if (/--/g.test(this.answer)) {
        let answers = this.answer.split("--");
        answers = answers.map((item) => item.trim().toLowerCase());
        if (answers.length != 3) {
          let length = 3 - answers.length;
          for (let i = 0; i < length; i++) answers.push("");
        }
        this.answer = answers.join("--");
      }

      if (this.answer == this.correctAnswer) {
        await this.animatedInput("correct");
        this.showAnswer(true);
        return;
      }

      this.try++;
      if (this.try >= this.$options.countTryToAnswer) {
        await this.animatedInput("wrong");
        this.showAnswer(false);
        return;
      }
      await this.animatedInput("between");

      if (this.word.irregularVerb == true) {
        let words = this.correctAnswer.split("--");
        let answers = this.answer.split("--");
        answers = answers.map((item) => item.trim().toLowerCase());
        if (answers.length != 3) {
          let length = 3 - answers.length;
          for (let i = 0; i < length; i++) answers.push("");
        }
        this.answer = answers.join("--");

        let index = 0;
        let correctLetters = ["", "", ""];
        for (let answerItem of answers) {
          let subIndex = 0;
          for (let letter of answerItem) {
            if (letter != words[index][subIndex]) break;
            correctLetters[index] += letter;
            subIndex++;
          }
          answers[index] = answerItem.substr(0, correctLetters[index].length);
          index++;
        }
        answers = answers.map((answer) => {
          if (answer.length == 0) return " ";
          return answer;
        });
        this.answer = answers.join("--");
        return;
      }

      let answer = this.answer;
      let index = 0;
      let correctLetters = "";
      for (let letter of answer) {
        if (letter != this.correctAnswer[index]) break;
        correctLetters += letter;
        index++;
      }
      this.answer = answer.substr(0, correctLetters.length);
      return;
    },
    reverseConfirm(event) {
      if (this.answer != "" || this.isVisibleAnswer == true) return;
      this.answer = event.target.textContent;
      if (this.answer != this.correctAnswer) {
        this.showAnswer(false);
        return;
      }
      this.showAnswer(true);
      return;
    },
    nextWord() {
      if (this.isVisibleAnswer == false || this.isVisibleNext == false) return;
      clearTimeout(this.$options.setTimeoutController);
      clearInterval(this.$options.timerContoller);
      this.$options.promiseController.resolve(this.isCorrectAnswer);
    },
  },
  watch: {
    answer() {
      if (this.errors?.answer) this.validateAnswer(this.answer);
    },
  },
};
</script>

<style></style>
