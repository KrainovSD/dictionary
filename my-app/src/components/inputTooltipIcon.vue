<template
  v-if="type == 'text' || type == 'password' || type == 'passwordAdvice'"
>
  <div
    class="inputIconContainer"
    :class="[
      errors?.[field] ? '_error' : '',
      focusInput == true ? '_focus' : '',
    ]"
  >
    <img :src="inputIcon" alt="" class="inputIconContainer__icon" />
    <input
      :type="type == 'text' ? 'text' : 'password'"
      class="inputIconContainer__input"
      :style="`font-size: ${fontSize}px`"
      :placeholder="placeholder"
      :name="field"
      autocomplete="off"
      :value="modelValue"
      ref="input"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="focusInput = true"
      @focusout="focusInput = false"
    />
    <img
      :src="eyeIcon"
      alt=""
      class="inputIconContainer__eye"
      ref="eye"
      @click.stop="switchTypeInput"
      v-if="type == 'password' || type == 'passwordAdvice'"
    />
    <div
      class="inputIconContainer__tooltip"
      v-if="errors?.[field] && focusInput == true && type != 'passwordAdvice'"
      :tooltip="errors?.[field]"
    ></div>

    <div
      class="inputIconContainer__tooltipAdvice"
      v-if="focusInput == true && type == 'passwordAdvice'"
    >
      <p>Надежный пароль должен содержать:</p>
      <br />
      <ul>
        <li
          class="inputIconContainer__advice"
          :class="advicesPassword.minSize ? '_active' : ''"
        >
          8 или более символов;
        </li>
        <li
          class="inputIconContainer__advice"
          :class="advicesPassword.numberAndLetter ? '_active' : ''"
        >
          Сочетаниe букв и цифр;
        </li>
        <li
          class="inputIconContainer__advice"
          :class="advicesPassword.lowerAndUpper ? '_active' : ''"
        >
          Сочетание верхнего и нижнего регистра
        </li>
        <li
          class="inputIconContainer__advice"
          :class="advicesPassword.specialSymbol ? '_active' : ''"
        >
          Специальные символы;
        </li>
        <li
          class="inputIconContainer__advice"
          :class="advicesPassword.blackList ? '_active' : ''"
        >
          Слова не входящие в черный список паролей;
        </li>
      </ul>
      <br />
      <p>Сложность пароля:</p>
      <div class="inputIconContainer__progressBar">
        <div
          class="inputIconContainer__progress"
          :class="progressOfPasswordAdvice"
        ></div>
      </div>
      <br />
      <p style="color: rgb(253, 69, 69)">{{ errors.password }}</p>
    </div>
  </div>
  <div
    class="inputIconContainer__adviceMobile"
    v-if="focusInput == true && type == 'passwordAdvice'"
  >
    <p>Сложность пароля:</p>
    <div class="inputIconContainer__progressBar">
      <div
        class="inputIconContainer__progress"
        :class="progressOfPasswordAdvice"
      ></div>
    </div>
    <br />
    <p style="color: rgb(253, 69, 69)">{{ errors.password }}</p>
  </div>
</template>

<script>
export default {
  emits: ["update:modelValue"],
  props: {
    modelValue: String,
    type: String,
    field: String,
    icon: String,
    placeholder: String,
    errors: Object,
    fontSize: String,
  },
  data() {
    return {
      focusInput: false,
      openEye: false,
      advicesPassword: {
        minSize: false,
        numberAndLetter: false,
        lowerAndUpper: false,
        specialSymbol: false,
        blackList: false,
      },
    };
  },
  computed: {
    inputIcon() {
      return require(`../assets/${this.icon}`);
    },
    eyeIcon() {
      if (this.openEye) {
        return require("../assets/eye.png");
      }
      return require("../assets/eye-crossed.png");
    },
    difficultyPassword() {
      let difficulty = 0;
      Object.values(this.advicesPassword).forEach((value) => {
        if (value) difficulty += 1;
      });
      return difficulty;
    },
    progressOfPasswordAdvice() {
      let style = "";
      switch (this.difficultyPassword) {
        case 1:
          style = "_veryEasy";
          break;
        case 2:
          style = "_easy";
          break;
        case 3:
          style = "_medium";
          break;
        case 4:
          style = "_high";
          break;
        case 5:
          style = "_veryHigh";
          break;
        default:
          style = "";
          break;
      }
      return style;
    },
  },
  methods: {
    switchTypeInput() {
      let input = this.$refs.input;
      let eye = this.$refs.eye;

      if (input.type == "password") {
        if (!eye.classList.contains("_active")) {
          eye.classList.toggle("_active");
          setTimeout(() => {
            eye.classList.toggle("_active");
          }, 300);
          setTimeout(() => {
            input.type = "text";
            this.openEye = true;
          }, 250);
        }
      } else {
        if (!eye.classList.contains("_active")) {
          eye.classList.toggle("_active");
          setTimeout(() => {
            eye.classList.toggle("_active");
          }, 300);
          setTimeout(() => {
            input.type = "password";
            this.openEye = false;
          }, 250);
        }
      }
    },
    checkAdviceComplete(password) {
      this.advicesPassword = {
        minSize: false,
        numberAndLetter: false,
        lowerAndUpper: false,
        specialSymbol: false,
        blackList: false,
      };

      const blackList = ["password", "world"];
      if (password.length > 8) {
        this.advicesPassword.minSize = true;
      }
      if (/\d/.test(password) && /[A-Za-zА-Яа-я]/.test(password)) {
        this.advicesPassword.numberAndLetter = true;
      }
      if (/[A-ZА-Я]/.test(password) && /[a-zа-я]/.test(password)) {
        this.advicesPassword.lowerAndUpper = true;
      }
      if (/[!@#$%^&*()_+=\-"№;%:?\\/[\]{}|'~` ><,.]/.test(password)) {
        this.advicesPassword.specialSymbol = true;
      }
      if (!blackList.includes(password)) {
        this.advicesPassword.blackList = true;
      }
    },
  },
  watch: {
    modelValue() {
      if (this.type == "passwordAdvice")
        this.checkAdviceComplete(this.modelValue);
    },
  },
};
</script>

<style>
.inputIconContainer {
  display: flex;
  border-radius: 3px;
  box-shadow: 0px 0px 4px 0px #ffffff;
  background-color: white;
  border: 1px solid white;
  transition: all 0.3s ease;
  position: relative;
}
.inputIconContainer._focus {
  border-color: #66afe9;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
}
.inputIconContainer._error {
  border-color: #e96666;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(233, 102, 102, 0.6);
}
.inputIconContainer__icon {
  width: 16px;
  height: 16px;
  margin: auto 0;
  margin-left: 8px;
}
.inputIconContainer__input {
  padding: 12px 10px;
  width: 100%;
}
.inputIconContainer__tooltip {
  position: absolute;
  display: inline-block;
  left: 100%;
  top: 50%;
}
.inputIconContainer__tooltip::after {
  content: attr(tooltip);
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: white;
  font-size: 16px;
  min-width: 250px;
  border-radius: 5px;
  pointer-events: none;
  padding: 9px 9px;
  z-index: 99;
  left: 200%;
  top: 50%;
  margin-left: 8px;
  transform: translateX(0%) translateY(-50%);
}
.inputIconContainer__tooltip::before {
  content: "";
  position: absolute;
  border-width: 4px 6px 0 6px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.7) transparent transparent transparent;
  z-index: 99;
  left: 100%;
  top: 50%;
  margin-left: 1px;
  transform: translatey(-50%) rotate(90deg);
}

.inputIconContainer__eye {
  cursor: pointer;
  width: 16px;
  height: 16px;
  margin: auto 5px auto 0;
}
.inputIconContainer__eye._active {
  animation: spin 0.3s ease;
}
.inputIconContainer__adviceMobile {
  display: none;
}
.inputIconContainer__tooltipAdvice {
  position: absolute;
  display: inline-block;
  left: 100%;
  top: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 16px;
  min-width: 350px;
  border-radius: 5px;
  pointer-events: none;
  padding: 9px 9px;
  z-index: 99;
  margin-left: 8px;
  transform: translateX(0%) translateY(-50%);
}
.inputIconContainer__tooltipAdvice::before {
  content: "";
  position: absolute;
  border-width: 4px 6px 0 6px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.7) transparent transparent transparent;
  z-index: 99;
  left: 8;
  top: 50%;
  transform: translatey(-50%) rotate(90deg);
}

.inputIconContainer__advice._active {
  color: greenyellow;
}
.inputIconContainer__progressBar {
  width: 100%;
  height: 20px;
  border: 1px solid white;
}

.inputIconContainer__progress._veryEasy {
  width: 20%;
  height: 100%;
  background-color: rgba(248, 24, 24, 0.7);
}
.inputIconContainer__progress._easy {
  width: 40%;
  height: 100%;
  background-color: rgba(255, 196, 2, 0.7);
}
.inputIconContainer__progress._medium {
  width: 60%;
  height: 100%;
  background-color: rgba(251, 255, 0, 0.7);
}
.inputIconContainer__progress._high {
  width: 80%;
  height: 100%;
  background-color: rgba(200, 255, 0, 0.7);
}
.inputIconContainer__progress._veryHigh {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 255, 21, 0.7);
}

@media (max-width: 1023px) {
  .inputIconContainer__tooltipAdvice {
    display: none;
  }
  .inputIconContainer__adviceMobile {
    display: block;
    margin: 5px 0 0 0;
  }
  .inputIconContainer__adviceMobile .inputIconContainer__progressBar {
    border: 1px solid black;
  }
}

@media (max-width: 767px) {
  .inputIconContainer__tooltip {
    left: 50%;
    top: -10%;
  }
  .inputIconContainer__tooltip::after {
    transform: translateX(-50%) translateY(-100%);
  }

  .inputIconContainer__tooltip::before {
    transform: translatey(-50%) rotate(0deg);
  }
}
</style>
