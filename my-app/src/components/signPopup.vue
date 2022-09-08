<template>
  <div class="modal__backDrop" @click.self="closePopup" ref="backDrop">
    <div class="sign" :class="signType == 'signUp' ? 'signUp' : ''">
      <img
        src="image/close.png"
        alt=""
        class="sign__closeButton"
        @click.stop="closePopup"
      />
      <div class="sign__container">
        <h1 class="sign__header" v-if="signType === 'signUp'">Регистрация</h1>
        <p class="sign__description" v-if="signType === 'signUp'"></p>
        <h1 class="sign__header" v-if="signType === 'signIn'">
          Вход в систему
        </h1>
        <p class="sign__description" v-if="signType === 'signIn'">
          Вход использует ваш Nickname и пароль
        </p>
        <div
          class="sign__inputContainer"
          :class="errors.nickName ? '_error' : ''"
        >
          <div class="sign__iconInputContainer">
            <img src="image/user.png" alt="" class="sign__inputIcon" />
          </div>
          <input
            type="text"
            class="sign__input"
            placeholder="NickName"
            name="nickName"
            v-model="nickName"
            autocomplete="off"
          />
          <div
            class="sign__tooltip"
            v-if="errors.nickName && currentFocusInput == 'nickName'"
            :tooltip="errors.nickName"
          ></div>
        </div>

        <div
          class="sign__inputContainer"
          v-if="signType === 'signUp'"
          :class="errors.userName ? '_error' : ''"
        >
          <div class="sign__iconInputContainer">
            <img src="image/userName.png" alt="" class="sign__inputIcon" />
          </div>

          <input
            type="text"
            class="sign__input"
            placeholder="UserName"
            name="userName"
            v-model="userName"
            autocomplete="off"
          />
          <div
            class="sign__tooltip"
            v-if="errors.userName && currentFocusInput == 'userName'"
            :tooltip="errors.userName"
          ></div>
        </div>

        <div
          class="sign__inputContainer"
          v-if="signType === 'signUp'"
          :class="errors.email ? '_error' : ''"
        >
          <div class="sign__iconInputContainer">
            <img src="image/email.png" alt="" class="sign__inputIcon" />
          </div>

          <input
            type="text"
            class="sign__input"
            placeholder="Email"
            name="email"
            v-model="email"
            autocomplete="off"
          />
          <div
            class="sign__tooltip"
            v-if="errors.email && currentFocusInput == 'email'"
            :tooltip="errors.email"
          ></div>
        </div>

        <div
          class="sign__inputContainer"
          :class="errors.password ? '_error' : ''"
        >
          <div class="sign__iconInputContainer">
            <img src="image/house-key.png" alt="" class="sign__inputIcon" />
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
              src="image/eye-crossed.png"
              alt=""
              class="sign__visiblePassword"
              ref="eyeIcon"
              @click.stop="switchTypeInput('password', 'eyeIcon')"
            />
          </div>
          <div
            class="sign__tooltip"
            v-if="
              errors.password &&
              currentFocusInput == 'password' &&
              signType == 'signIn'
            "
            :tooltip="errors.password"
          ></div>
          <div
            class="sign__tooltipPassword"
            v-if="currentFocusInput == 'password' && signType == 'signUp'"
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

        <div
          class="sign__inputContainer"
          v-if="signType === 'signUp'"
          :class="errors.repeatPassword ? '_error' : ''"
        >
          <div class="sign__iconInputContainer">
            <img src="image/padlock.png" alt="" class="sign__inputIcon" />
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
              src="image/eye-crossed.png"
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

        <button
          class="sign__logInButton"
          ref="logInButton"
          @click.stop="sendData"
          v-if="signType === 'signIn'"
        >
          Войти
        </button>
        <button
          class="sign__logInButton"
          ref="logInButton"
          @click.stop="sendData"
          v-if="signType === 'signUp'"
        >
          Регистрация
        </button>
        <div class="sign__actions" v-if="signType === 'signIn'">
          <p class="sign__forgotPassword">
            Забыли <br />
            пароль?
          </p>
          <div class="sign__signInButton">
            <p class="sign__signInButtonTitle">Регистрация</p>
            <img
              src="image/add-friend.png"
              alt=""
              class="sign_signInButtonIcon"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    signType: String,
  },
  data() {
    return {
      nickName: "",
      userName: "",
      email: "",
      password: "",
      repeatPassword: "",
      errors: {},
      currentFocusInput: "",
      advicesPassword: {
        minSize: false,
        numberAndLetter: false,
        lowerAndUpper: false,
        specialSymbol: false,
        blackList: false,
      },
      a: 0,
    };
  },
  mounted() {
    let inputs = Array.from(document.querySelectorAll("input"));
    inputs.forEach((input) => {
      input.addEventListener("focus", this.selectInput);
    });
    inputs.forEach((input) => {
      input.addEventListener("focusout", this.unSelectInput);
    });
  },
  beforeUnmount() {
    let inputs = Array.from(document.querySelectorAll("input"));
    inputs.forEach((input) => {
      input.removeEventListener("focus", this.selectInput);
    });
    inputs.forEach((input) => {
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
  },
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
    switchTypeInput(kindOfInput, kindOfEye) {
      if (this.$refs[kindOfInput].type === "password") {
        if (!this.$refs[kindOfEye].classList.contains("_active")) {
          this.$refs[kindOfEye].classList.toggle("_active");
          setTimeout(() => {
            this.$refs[kindOfEye].classList.toggle("_active");
          }, 300);
          setTimeout(() => {
            this.$refs[kindOfInput].type = "text";
            let path = this.$refs[kindOfEye].src.split("/");
            path[path.length - 1] = "eye.png";
            this.$refs[kindOfEye].src = path.join("/");
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
            let path = this.$refs[kindOfEye].src.split("/");
            path[path.length - 1] = "eye-crossed.png";
            this.$refs[kindOfEye].src = path.join("/");
          }, 250);
        }
      }
    },
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
    validateForm(form) {
      this.errors = {};
      Object.keys(form).forEach((key) => {
        if (typeof form[key] !== "string") {
          this.errors[key] = "Неверный тип данных!";
          return;
        }
        if (form[key].length == 0) {
          this.errors[key] = "Поле обязательно для заполнения!";
          return;
        }
        switch (key) {
          case "nickName":
            if (!/^([A-Za-z0-9_]+)$/.test(form[key])) {
              this.errors[key] =
                "NickName должнен состоять только из латинских букв, цифр или символа нижнего подчеркивания!";
              return;
            }
            if (form[key].length < 3 && form[key].length > 25) {
              this.errors[key] =
                "Длина NickName не должна превышать 25 символов или быть меньше, чем 3 символа!";
              return;
            }
            break;
          case "userName":
            if (!/^([A-Za-zА-Яа-я]+)$/.test(form[key])) {
              this.errors[key] =
                "Имя может содержать только латинские или русские буквы!";
              return;
            }
            if (form[key].length < 2 && form[key].length > 15) {
              this.errors[key] =
                "Длина Имени не должна превышать 15 символов или быть меньше, чем 2 символа! Если ваше имя содержит более 15-ти символов, используйте, пожалуйста, сокращенную версию!";
              return;
            }
            break;
          case "email":
            if (
              !/^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/.test(
                form[key]
              )
            ) {
              this.errors[key] = "Неверный формат введенного Email!";
              return;
            }
            break;
          case "password":
            if (form[key].length < 8) {
              this.errors[key] =
                "Пароль должен состоять не менее, чем из 8 символов!";
              return;
            }
            break;
          case "repeatPassword":
            if (!(form[key] === form.password)) {
              this.errors[key] = "Пароли не совпадают!";
              return;
            }
            break;
          default:
            break;
        }
      });
    },
    validateField(field, fieldData) {
      if (this.errors[field]) {
        if (typeof field !== "string") {
          this.errors[field] = "Неверный тип данных!";
          return;
        }
        if (fieldData.length == 0) {
          this.errors[field] = "Поле обязательно для заполнения!";
          return;
        }
        switch (field) {
          case "nickName":
            if (!/^([A-Za-z0-9_]+)$/.test(fieldData)) {
              this.errors[field] =
                "NickName должнен состоять только из латинских букв, цифр или символа нижнего подчеркивания!";
              return;
            }
            if (fieldData.length < 3 && fieldData.length > 25) {
              this.errors[field] =
                "Длина NickName не должна превышать 25 символов или быть меньше, чем 3 символа!";
              return;
            }
            break;
          case "userName":
            if (!/^([A-Za-zА-Яа-я]+)$/.test(fieldData)) {
              this.errors[field] =
                "Имя может содержать только латинские или русские буквы!";
              return;
            }
            if (fieldData.length < 2 && fieldData.length > 15) {
              this.errors[field] =
                "Длина Имени не должна превышать 15 символов или быть меньше, чем 2 символа! Если ваше имя содержит более 15-ти символов, используйте, пожалуйста, сокращенную версию!";
              return;
            }
            break;
          case "email":
            if (
              !/^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/.test(
                fieldData
              )
            ) {
              this.errors[field] = "Неверный формат введенного Email!";
              return;
            }
            break;
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
          default:
            break;
        }
        delete this.errors[field];
      }
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
      if (!this.$refs.logInButton.classList.contains("_active")) {
        this.$refs.logInButton.classList.toggle("_active");
        let form = {};
        if (this.signType == "signIn") {
          form.nickName = this.nickName.trim();
          form.password = this.password.trim();
        } else if (this.signType == "signUp") {
          form.nickName = this.nickName.trim();
          form.userName = this.userName.trim().toLowerCase();
          form.email = this.email.trim().toLowerCase();
          form.password = this.password.trim();
          form.repeatPassword = this.repeatPassword.trim();
        }
        this.validateForm(form);
        if (Object.keys(this.errors).length === 0) {
          setTimeout(() => {
            this.$refs.logInButton.classList.toggle("_active");
            this.$emit("sign", form);
          }, 300);
        } else {
          console.log(this.errors);
          setTimeout(() => {
            this.$refs.logInButton.classList.toggle("_active");
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
    nickName() {
      this.validateField("nickName", this.nickName);
    },
    userName() {
      this.validateField("userName", this.userName);
    },
    email() {
      this.validateField("email", this.email);
    },
    repeatPassword() {
      this.validateField("repeatPassword", this.repeatPassword);
    },
  },
};
</script>

<style></style>
