<template>
  <div class="newPassword">
    <div class="newPassword__container">
      <div class="sign__container">
        <h1 class="sign__header">Новый пароль</h1>
        <p class="sign__description">Придумайте свой новый пароль</p>
        <div
          class="sign__inputContainer"
          :class="errors.password ? '_error' : ''"
        >
          <div class="sign__iconInputContainer">
            <img src="@/assets/house-key.png" alt="" class="sign__inputIcon" />
          </div>

          <input
            type="password"
            class="sign__input"
            placeholder="Password"
            ref="password"
            name="password"
            v-model="password"
            autocomplete="off"
          />
          <div class="sign__iconInputContainer">
            <img
              :src="passwordIcon"
              alt=""
              class="sign__visiblePassword"
              ref="eyeIcon"
              @click.stop="switchTypeInput('password', 'eyeIcon')"
            />
          </div>
          <div
            class="sign__tooltip"
            v-if="errors.password && currentFocusInput == 'password'"
            :tooltip="errors.password"
          ></div>
          <div
            class="sign__tooltipPassword"
            v-if="currentFocusInput == 'password'"
          >
            <p>Надежный пароль должен содержать:</p>
            <br />
            <ul>
              <li
                class="sign__advicePassword"
                :class="advicesPassword.minSize ? '_active' : ''"
              >
                8 или более символов;
              </li>
              <li
                class="sign__advicePassword"
                :class="advicesPassword.numberAndLetter ? '_active' : ''"
              >
                Сочетаниe букв и цифр;
              </li>
              <li
                class="sign__advicePassword"
                :class="advicesPassword.lowerAndUpper ? '_active' : ''"
              >
                Сочетание верхнего и нижнего регистра
              </li>
              <li
                class="sign__advicePassword"
                :class="advicesPassword.specialSymbol ? '_active' : ''"
              >
                Специальные символы;
              </li>
              <li
                class="sign__advicePassword"
                :class="advicesPassword.blackList ? '_active' : ''"
              >
                Слова не входящие в черный список паролей;
              </li>
            </ul>
            <br />
            <p>Сложность пароля:</p>
            <div class="sign__difficultyPassword">
              <div
                class="sign__difficultyPasswordBar"
                :class="barOfDifficultyPassword"
              ></div>
            </div>
            <br />
            <p style="color: rgb(253, 69, 69)">{{ errors.password }}</p>
          </div>
        </div>
        <!-- REPEATPASSWORD -->
        <div
          class="sign__inputContainer"
          :class="errors.repeatPassword ? '_error' : ''"
        >
          <div class="sign__iconInputContainer">
            <img src="@/assets/padlock.png" alt="" class="sign__inputIcon" />
          </div>

          <input
            type="password"
            class="sign__input"
            placeholder="Repeat Password"
            ref="repeatPassword"
            name="repeatPassword"
            v-model="repeatPassword"
            autocomplete="off"
          />

          <div class="sign__iconInputContainer">
            <img
              :src="repeatPasswordIcon"
              alt=""
              class="sign__visiblePassword"
              ref="repeatEyeIcon"
              @click.stop="switchTypeInput('repeatPassword', 'repeatEyeIcon')"
            />
          </div>
          <div
            class="sign__tooltip"
            v-if="
              errors.repeatPassword && currentFocusInput == 'repeatPassword'
            "
            :tooltip="errors.repeatPassword"
          ></div>
        </div>
        <!-- RESPONSE -->
        <p class="sign__infoMessage">{{ responseMessage }}</p>

        <button class="sign__logInButton" ref="confirm" @click.stop="sendData">
          Отправить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    test: String,
  },
  data() {
    return {
      password: "",
      repeatPassword: "",
      advicesPassword: {
        minSize: false,
        numberAndLetter: false,
        lowerAndUpper: false,
        specialSymbol: false,
        blackList: false,
      },
      selectPasswordIcon: "eye-crossed.png",
      selectRepeatPasswordIcon: "eye-crossed.png",
      errors: {},
      key: "",
      currentFocusInput: "",

      responseMessage: "",
    };
  },
  mounted() {
    this.key = this.$route.params.key;
    let inputs = Array.from(document.querySelectorAll("input"));
    inputs.forEach((input) => {
      input.addEventListener("focus", this.selectInput);
      input.addEventListener("focusout", this.unSelectInput);
    });
  },
  beforeUnmount() {
    let inputs = Array.from(document.querySelectorAll("input"));
    inputs.forEach((input) => {
      input.removeEventListener("focus", this.selectInput);
      input.removeEventListener("focusout", this.unSelectInput);
    });
  },
  computed: {
    difficultyPassword() {
      let difficulty = 0;
      Object.values(this.advicesPassword).forEach((value) => {
        if (value) difficulty += 1;
      });
      return difficulty;
    },
    barOfDifficultyPassword() {
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
    passwordIcon() {
      if (!this.selectPasswordIcon != "") {
        return;
      }
      return require(`../assets/${this.selectPasswordIcon}`);
    },
    repeatPasswordIcon() {
      if (!this.selectRepeatPasswordIcon != "") {
        return;
      }
      return require(`../assets/${this.selectRepeatPasswordIcon}`);
    },
  },
  methods: {
    selectInput(event) {
      let parent = event.target.parentElement;
      if (!parent.classList.contains("_focus")) {
        parent.classList.toggle("_focus");
        this.currentFocusInput = event.target.name;
      }
    },
    unSelectInput(event) {
      let parent = event.target.parentElement;
      if (parent.classList.contains("_focus")) {
        parent.classList.toggle("_focus");
        this.currentFocusInput = "";
      }
    },
    switchTypeInput(kindOfInput, kindOfEye) {
      if (this.$refs[kindOfInput].type === "password") {
        if (!this.$refs[kindOfEye].classList.contains("_active")) {
          this.$refs[kindOfEye].classList.toggle("_active");
          setTimeout(() => {
            this.$refs[kindOfEye].classList.toggle("_active");
          }, 300);
          setTimeout(() => {
            this.$refs[kindOfInput].type = "text";
            if (kindOfEye == "eyeIcon") this.selectPasswordIcon = "eye.png";
            else if (kindOfEye == "repeatEyeIcon")
              this.selectRepeatPasswordIcon = "eye.png";
          }, 250);
        }
      } else if (this.$refs[kindOfInput].type === "text") {
        if (!this.$refs[kindOfEye].classList.contains("_active")) {
          this.$refs[kindOfEye].classList.toggle("_active");
          setTimeout(() => {
            this.$refs[kindOfEye].classList.toggle("_active");
          }, 300);
          setTimeout(() => {
            this.$refs[kindOfInput].type = "password";
            if (kindOfEye == "eyeIcon")
              this.selectPasswordIcon = "eye-crossed.png";
            else if (kindOfEye == "repeatEyeIcon")
              this.selectRepeatPasswordIcon = "eye-crossed.png";
          }, 250);
        }
      }
    },
    validateField(field, fieldData) {
      if (this.errors[field]) {
        switch (field) {
          case "password":
            if (fieldData.length < 8) {
              this.errors[field] =
                "Пароль должен состоять не менее, чем из 8 символов!";
              return;
            }
            break;
          case "repeatPassword":
            if (!(fieldData === this.password)) {
              this.errors[field] = "Пароли не совпадают!";
              return;
            }
            break;
        }
        delete this.errors[field];
      }
    },
    validateForm(form) {
      this.errors = {};
      Object.keys(form).forEach((field) => {
        let fieldData = form[field];
        switch (field) {
          case "password":
            if (fieldData.length < 8) {
              this.errors[field] =
                "Пароль должен состоять не менее, чем из 8 символов!";
              return;
            }
            break;
          case "repeatPassword":
            if (!(fieldData === form.password)) {
              this.errors[field] = "Пароли не совпадают!";
              return;
            }
            break;
        }
      });
    },
    adviceForPassword(password) {
      this.advicesPassword = {
        minSize: false,
        numberAndLetter: false,
        lowerAndUpper: false,
        specialSymbol: false,
        blackList: false,
      };

      let blackList = ["password", "world"];
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
    sendData() {
      let confirm = this.$refs.confirm;
      if (!confirm.classList.contains("_active")) {
        confirm.classList.toggle("_active");

        let form = {
          password: this.password,
          repeatPassword: this.repeatPassword,
        };

        this.validateForm(form);

        if (Object.keys(this.errors).length === 0) {
          setTimeout(() => {
            confirm.classList.toggle("_active");
            console.log("OK");
          }, 300);
        } else {
          console.log(this.errors);
          setTimeout(() => {
            confirm.classList.toggle("_active");
          }, 300);
        }
      }
    },
  },
  watch: {
    password() {
      this.adviceForPassword(this.password);
      this.validateField("password", this.password);
    },
    repeatPassword() {
      this.validateField("repeatPassword", this.repeatPassword);
    },
  },
};
</script>

<style></style>
