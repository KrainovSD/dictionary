<template>
  <forgot-password
    v-if="forgotPasswordVisible == true"
    @close="forgotPasswordVisible = false"
  />
  <div class="modal__backDrop" ref="backDrop" style="z-index: 5">
    <div class="sign" :class="signType == 'signUp' ? 'signUp' : ''">
      <img
        src="@/assets/close.png"
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

        <div class="sign__inputIconContainer">
          <input-tooltip-icon
            v-model="nickName"
            type="text"
            field="nickName"
            icon="user.png"
            placeholder="NickName"
            fontSize="14"
            :errors="errors"
          />
        </div>

        <div class="sign__inputIconContainer" v-if="signType === 'signUp'">
          <input-tooltip-icon
            v-model="userName"
            type="text"
            field="userName"
            icon="userName.png"
            placeholder="UserName"
            fontSize="14"
            :errors="errors"
          />
        </div>

        <div class="sign__inputIconContainer" v-if="signType === 'signUp'">
          <input-tooltip-icon
            v-model="email"
            type="text"
            field="email"
            icon="email.png"
            placeholder="Email"
            fontSize="14"
            :errors="errors"
          />
        </div>

        <div class="sign__inputIconContainer" v-if="signType === 'signUp'">
          <input-tooltip-icon
            v-model="password"
            type="passwordAdvice"
            field="password"
            icon="house-key.png"
            placeholder="Password"
            fontSize="14"
            :errors="errors"
          />
        </div>

        <div class="sign__inputIconContainer" v-if="signType === 'signIn'">
          <input-tooltip-icon
            v-model="password"
            type="password"
            field="password"
            icon="house-key.png"
            placeholder="Password"
            fontSize="14"
            :errors="errors"
          />
        </div>

        <div class="sign__inputIconContainer" v-if="signType === 'signUp'">
          <input-tooltip-icon
            v-model="repeatPassword"
            type="password"
            field="repeatPassword"
            icon="padlock.png"
            placeholder="Repeat Password"
            fontSize="14"
            :errors="errors"
          />
        </div>

        <!-- RESPONSE -->
        <p class="sign__infoMessage">{{ responseMessage }}</p>

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
          <p class="sign__forgotPassword" @click="forgotPasswordVisible = true">
            Забыли <br />
            пароль?
          </p>
          <div class="sign__signInButton" @click="switchTypeSign">
            <p class="sign__signInButtonTitle">Регистрация</p>
            <img
              src="@/assets/add-friend.png"
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
import forgotPassword from "../components/forgotPassword.vue";
import inputTooltipIcon from "../components/inputTooltipIcon.vue";
export default {
  components: {
    forgotPassword,
    inputTooltipIcon,
  },
  emits: ["close", "sign", "switch"],
  props: {
    signType: String,
    responseMessage: String,
  },
  data() {
    return {
      nickName: "",
      userName: "",
      email: "",
      password: "",
      repeatPassword: "",
      errors: {},
      forgotPasswordVisible: false,
    };
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
    clearData() {
      this.forgotPasswordVisible = false;
      this.nickName = "";
      this.userName = "";
      this.email = "";
      this.password = "";
      this.repeatPassword = "";
      this.errors = {};
    },
    switchTypeSign() {
      if (!this.$refs.backDrop.classList.contains("close")) {
        this.$refs.backDrop.classList.toggle("close");
        setTimeout(() => {
          this.$refs.backDrop.classList.toggle("close");
          this.clearData();
          this.$emit("switch");
        }, 300);
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
        if (typeof fieldData !== "string") {
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
